from __future__ import annotations

from pathlib import Path
import tempfile
import unittest

from research_wiki_mcp.config import AppConfig
from research_wiki_mcp.service import ResearchWikiService

try:
    import fitz
except ImportError:  # pragma: no cover
    fitz = None


class ResearchWikiServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self.temp_dir.name)
        self.service = ResearchWikiService(AppConfig.from_root(self.root))

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_save_search_review_and_resources(self) -> None:
        self.service.save_page(
            page_type="source",
            slug="sample-paper",
            title="Sample Paper",
            author="Researcher",
            author_email="researcher@example.com",
            body="# Sample\n\nVisibility evidence.",
            language="ko",
            sources=["raw/papers/sample.pdf"],
            tags=["visibility"],
        )

        self.assertEqual([item["slug"] for item in self.service.search("visibility")], ["sample-paper"])
        reviewed = self.service.review_page(
            "source",
            "sample-paper",
            author="Reviewer",
            author_email="reviewer@example.com",
        )
        self.assertEqual(reviewed["status"], "reviewed")
        self.assertIn('"sample-paper"', self.service.index_resource())
        self.assertIn('"status": "reviewed"', self.service.page_resource("source", "sample-paper"))

    def test_list_papers_reports_gui_state(self) -> None:
        paper_path = self.root / "raw" / "papers" / "sample.pdf"
        paper_path.write_bytes(b"%PDF placeholder")
        self.assertEqual(self.service.list_papers()[0]["color"], "red")

        self.service.save_page(
            page_type="source",
            slug="sample",
            title="Sample",
            author="Researcher",
            author_email="researcher@example.com",
            body="# Sample",
            sources=["raw/papers/sample.pdf"],
        )
        partial = self.service.list_papers()[0]
        self.assertEqual(partial["color"], "amber")
        self.assertEqual(partial["state"], "source-draft")

        self.service.save_page(
            page_type="concept",
            slug="sample-concept",
            title="Sample Concept",
            author="Researcher",
            author_email="researcher@example.com",
            body="# Sample Concept",
            sources=["raw/papers/sample.pdf"],
        )
        self.assertEqual(self.service.list_papers()[0]["color"], "blue")

    def test_capture_discussion_creates_appends_and_deduplicates_draft_page(self) -> None:
        created = self.service.capture_discussion(
            page_type="claim",
            slug="visibility-guidance",
            title="Visibility Guidance",
            author="Codex",
            author_email="codex@example.local",
            entry="Visibility gradients may help preserve edge-sensitive denoising behavior.",
            rationale="Reusable research hypothesis.",
            sources=["raw/papers/sample.pdf"],
            tags=["visibility"],
        )
        self.assertTrue(created["captured"])
        self.assertEqual(created["status"], "draft")
        self.assertIn("## Discussion Captures", created["body"])
        self.assertIn("discussion-capture", created["tags"])

        repeated = self.service.capture_discussion(
            page_type="claim",
            slug="visibility-guidance",
            title="Ignored Replacement Title",
            author="Codex",
            author_email="codex@example.local",
            entry="Visibility gradients may help preserve edge-sensitive denoising behavior.",
            rationale="Duplicate invocation.",
        )
        self.assertFalse(repeated["captured"])
        self.assertEqual(repeated["title"], "Visibility Guidance")
        self.assertEqual(len(self.service.list_revisions("claim", "visibility-guidance")), 1)

        self.service.review_page(
            "claim",
            "visibility-guidance",
            author="Reviewer",
            author_email="reviewer@example.local",
        )
        appended = self.service.capture_discussion(
            page_type="claim",
            slug="visibility-guidance",
            title="Ignored Replacement Title",
            author="Codex",
            author_email="codex@example.local",
            entry="A controlled ablation should separate gradient conditioning from raw visibility conditioning.",
            rationale="Durable validation requirement.",
            sources=["raw/papers/second.pdf"],
            tags=["ablation"],
            confidence="low",
        )
        self.assertTrue(appended["captured"])
        self.assertEqual(appended["status"], "draft")
        self.assertEqual(appended["confidence"], "medium")
        self.assertEqual(appended["sources"], ["raw/papers/sample.pdf", "raw/papers/second.pdf"])
        self.assertEqual(appended["tags"], ["visibility", "discussion-capture", "ablation"])

    def test_capture_discussion_rejects_system_page(self) -> None:
        with self.assertRaisesRegex(ValueError, "discussion capture page type"):
            self.service.capture_discussion(
                page_type="system",
                slug="index",
                title="Index",
                author="Codex",
                author_email="codex@example.local",
                entry="Do not append discussion captures to system pages.",
                rationale="Invalid page type.",
            )

    @unittest.skipUnless(fitz, "PyMuPDF is required for WIKI image publishing")
    def test_publish_pdf_screenshots_returns_git_managed_markdown_images(self) -> None:
        pdf_path = self.root / "raw" / "papers" / "sample.pdf"
        pdf_path.parent.mkdir(parents=True, exist_ok=True)
        document = fitz.open()
        page = document.new_page()
        page.insert_text((72, 72), "WIKI image fixture")
        document.save(pdf_path)
        document.close()

        published = self.service.publish_pdf_screenshots(
            pdf_path=str(pdf_path),
            asset_group="sample-paper",
            author="Codex",
            author_email="codex@example.local",
            pages="1",
            dpi=72,
        )

        self.assertEqual(len(published), 1)
        self.assertEqual(published[0]["asset_path"], "wiki/assets/sample-paper/page-0001-dpi-72.png")
        self.assertEqual(
            published[0]["markdown_image"],
            "![PDF page 1](../assets/sample-paper/page-0001-dpi-72.png)",
        )
        self.assertTrue((self.root / published[0]["asset_path"]).is_file())
        self.assertEqual(
            self.service.repository.git.history(self.root / published[0]["asset_path"])[0].message,
            "wiki: publish PDF screenshots for sample-paper",
        )
        repeated = self.service.publish_pdf_screenshots(
            pdf_path=str(pdf_path),
            asset_group="sample-paper",
            author="Codex",
            author_email="codex@example.local",
            pages="1",
            dpi=72,
        )
        self.assertEqual(repeated[0]["asset_path"], published[0]["asset_path"])
        self.assertEqual(len(self.service.repository.git.history(self.root / published[0]["asset_path"])), 1)


if __name__ == "__main__":
    unittest.main()
