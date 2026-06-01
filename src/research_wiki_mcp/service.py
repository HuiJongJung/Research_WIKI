"""Deterministic application service exposed through MCP and the local GUI."""

from __future__ import annotations

from dataclasses import asdict
from hashlib import sha256
import json
from pathlib import Path
import re
from typing import Any

from .config import AppConfig
from .index import SearchResult, WikiIndex
from .models import WikiPage
from .pdf import PdfExtractor
from .repository import PageRepository


class ResearchWikiService:
    """Coordinate canonical storage, derived search, and local PDF extraction."""

    def __init__(self, config: AppConfig) -> None:
        self.config = config
        self.repository = PageRepository(config)
        self.index = WikiIndex(config)
        self.pdf = PdfExtractor(config)
        self.index.rebuild()

    def search(
        self,
        query: str = "",
        *,
        page_type: str | None = None,
        status: str | None = None,
        tag: str | None = None,
        language: str | None = None,
        limit: int = 50,
    ) -> list[dict[str, Any]]:
        return [
            self._search_result_dict(result)
            for result in self.index.search(
                query,
                page_type=page_type,
                status=status,
                tag=tag,
                language=language,
                limit=limit,
            )
        ]

    def read_page(self, page_type: str, slug: str) -> dict[str, Any]:
        return self._page_dict(self.repository.read(page_type, slug))

    def save_page(
        self,
        *,
        page_type: str,
        slug: str,
        title: str,
        author: str,
        author_email: str,
        body: str,
        status: str = "draft",
        language: str = "ko",
        confidence: str = "low",
        sources: list[str] | None = None,
        tags: list[str] | None = None,
    ) -> dict[str, Any]:
        page = self.repository.save(
            WikiPage(
                page_type=page_type,
                slug=slug,
                title=title,
                status=status,
                author=author,
                language=language,
                confidence=confidence,
                sources=tuple(sources or ()),
                tags=tuple(tags or ()),
                body=body,
            ),
            author_email=author_email,
        )
        self.index.rebuild()
        return self._page_dict(page)

    def create_research_page(
        self,
        *,
        page_type: str,
        slug: str,
        title: str,
        author: str,
        author_email: str,
        body: str,
        language: str = "ko",
        confidence: str = "low",
        sources: list[str] | None = None,
        tags: list[str] | None = None,
    ) -> dict[str, Any]:
        if page_type not in {"claim", "question"}:
            raise ValueError("research page type must be claim or question")
        return self.save_page(
            page_type=page_type,
            slug=slug,
            title=title,
            author=author,
            author_email=author_email,
            body=body,
            language=language,
            confidence=confidence,
            sources=sources,
            tags=tags,
        )

    def review_page(self, page_type: str, slug: str, *, author: str, author_email: str) -> dict[str, Any]:
        page = self.repository.review(page_type, slug, author=author, author_email=author_email)
        self.index.rebuild()
        return self._page_dict(page)

    def list_revisions(self, page_type: str, slug: str) -> list[dict[str, Any]]:
        return [asdict(revision) for revision in self.repository.history(page_type, slug)]

    def restore_revision(
        self,
        page_type: str,
        slug: str,
        revision: str,
        *,
        author: str,
        author_email: str,
    ) -> dict[str, Any]:
        page = self.repository.restore_revision(
            page_type,
            slug,
            revision,
            author=author,
            author_email=author_email,
        )
        self.index.rebuild()
        return self._page_dict(page)

    def rebuild_index(self) -> dict[str, int]:
        rebuilt = self.index.rebuild()
        return {"rebuilt": rebuilt, "count": self.index.count()}

    def extract_pdf_text(
        self,
        pdf_path: str,
        *,
        pages: str | None = None,
        reflection_language: str = "ko",
    ) -> list[dict[str, Any]]:
        return [
            asdict(chunk)
            for chunk in self.pdf.extract_text(
                pdf_path,
                pages=pages,
                reflection_language=reflection_language,
            )
        ]

    def render_pdf_screenshots(
        self,
        pdf_path: str,
        *,
        pages: str | None = None,
        dpi: int = 144,
        reflection_language: str = "ko",
    ) -> list[dict[str, Any]]:
        return [
            {
                **asdict(artifact),
                "image_path": str(artifact.image_path),
            }
            for artifact in self.pdf.render_screenshots(
                pdf_path,
                pages=pages,
                dpi=dpi,
                reflection_language=reflection_language,
            )
        ]

    def register_pdf_source_draft(
        self,
        *,
        pdf_path: str,
        title: str,
        slug: str = "",
        author: str,
        author_email: str,
        reading_mode: str = "text",
        pages: str | None = None,
        dpi: int = 144,
        reflection_language: str = "ko",
    ) -> dict[str, Any]:
        """Persist extracted original PDF text as an editable source draft."""

        path = Path(pdf_path).expanduser().resolve()
        if reading_mode == "text":
            artifacts = self.extract_pdf_text(
                str(path),
                pages=pages,
                reflection_language=reflection_language,
            )
        elif reading_mode == "screenshot":
            artifacts = self.render_pdf_screenshots(
                str(path),
                pages=pages,
                dpi=dpi,
                reflection_language=reflection_language,
            )
        else:
            raise ValueError("reading_mode must be text or screenshot")

        source = self._paper_source(path)
        page_slug = slug.strip() or self._source_slug(path.stem, source)
        page_title = title.strip() or path.stem
        body_lines = [
            f"# {page_title}",
            "",
            "## Ingest Metadata",
            "",
            f"- PDF: `{source}`",
            f"- Reading mode: `{reading_mode}`",
            f"- Reflection language: `{reflection_language}`",
            "",
            "## Extracted Original Text",
            "",
            "> This source draft preserves extracted original text. Refine it and create reusable concept pages with Codex or Claude Code.",
        ]
        for artifact in artifacts:
            body_lines.extend(
                [
                    "",
                    f"### Page {artifact['page_number']}",
                    "",
                    artifact.get("text", "").strip(),
                ]
            )
            if artifact.get("image_path"):
                body_lines.extend(["", f"- Screenshot artifact: `{artifact['image_path']}`"])

        page = self.save_page(
            page_type="source",
            slug=page_slug,
            title=page_title,
            author=author,
            author_email=author_email,
            body="\n".join(body_lines).rstrip() + "\n",
            language=reflection_language,
            confidence="low",
            sources=[source],
            tags=["paper-ingest", "source-draft"],
        )
        page["next_step"] = "Refine this source draft and create concept pages with Codex or Claude Code."
        return page

    def list_papers(self) -> list[dict[str, Any]]:
        source_pages = self.index.search(page_type="source", limit=500)
        concept_pages = self.index.search(page_type="concept", limit=500)
        comparison_pages = self.index.search(page_type="comparison", limit=500)
        source_reflections = {source for page in source_pages for source in page.sources}
        concept_reflections = {source for page in concept_pages for source in page.sources}
        compared_sources = {source for page in comparison_pages for source in page.sources}
        papers = []
        for path in sorted(self.config.raw_papers_root.glob("*.pdf")):
            source = path.relative_to(self.config.project_root).as_posix()
            source_registered = source in source_reflections
            concept_registered = source in concept_reflections
            reflected = source_registered and concept_registered
            state = "reflected" if reflected else "source-draft" if source_registered else "unread"
            papers.append(
                {
                    "path": str(path),
                    "source": source,
                    "name": path.name,
                    "reflected": reflected,
                    "source_registered": source_registered,
                    "concept_registered": concept_registered,
                    "state": state,
                    "color": "blue" if reflected else "amber" if source_registered else "red",
                    "comparison_badge": source in compared_sources,
                }
            )
        return papers

    def _paper_source(self, path: Path) -> str:
        try:
            return path.relative_to(self.config.project_root).as_posix()
        except ValueError:
            return str(path)

    @staticmethod
    def _source_slug(stem: str, source: str) -> str:
        slug = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
        if not slug:
            slug = "paper"
        digest = sha256(source.encode("utf-8")).hexdigest()[:8]
        return f"{slug[:64].rstrip('-')}-{digest}"

    def index_resource(self) -> str:
        return self._json({"pages": self.search(limit=500)})

    def papers_resource(self) -> str:
        return self._json({"papers": self.list_papers()})

    def page_resource(self, page_type: str, slug: str) -> str:
        return self._json(self.read_page(page_type, slug))

    @staticmethod
    def _page_dict(page: WikiPage) -> dict[str, Any]:
        data = asdict(page)
        data["updated_at"] = page.updated_at.isoformat() if page.updated_at else None
        data["sources"] = list(page.sources)
        data["tags"] = list(page.tags)
        return data

    @staticmethod
    def _search_result_dict(result: SearchResult) -> dict[str, Any]:
        data = asdict(result)
        data["sources"] = list(result.sources)
        data["tags"] = list(result.tags)
        return data

    @staticmethod
    def _json(value: Any) -> str:
        return json.dumps(value, ensure_ascii=False, indent=2)
