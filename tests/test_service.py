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
