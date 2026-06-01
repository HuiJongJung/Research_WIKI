from __future__ import annotations

from pathlib import Path
import tempfile
import unittest

from research_wiki_mcp.config import AppConfig
from research_wiki_mcp.service import ResearchWikiService


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


if __name__ == "__main__":
    unittest.main()
