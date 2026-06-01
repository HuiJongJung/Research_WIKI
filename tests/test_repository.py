from __future__ import annotations

from dataclasses import replace
import tempfile
import unittest

from research_wiki_mcp.config import AppConfig
from research_wiki_mcp.markdown import parse_page, render_page
from research_wiki_mcp.models import WikiPage
from research_wiki_mcp.repository import PageRepository


class PageRepositoryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.repository = PageRepository(AppConfig.from_root(self.temp_dir.name))
        self.author_email = "researcher@example.com"

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_save_read_review_history_and_restore(self) -> None:
        original = WikiPage(
            page_type="source",
            slug="example-paper",
            title="Example Paper",
            author="Researcher",
            confidence="medium",
            sources=("raw/papers/example.pdf",),
            tags=("paper", "rendering"),
            body="# Example Paper\n\nInitial reflection. [p. 1]",
        )

        stored = self.repository.save(original, author_email=self.author_email)
        edited = self.repository.save(
            replace(stored, body="# Example Paper\n\nEdited reflection. [p. 2]"),
            author_email=self.author_email,
        )
        reviewed = self.repository.review(
            "source",
            "example-paper",
            author="Reviewer",
            author_email="reviewer@example.com",
        )

        self.assertEqual(self.repository.read("source", "example-paper"), reviewed)
        self.assertEqual(reviewed.status, "reviewed")
        revisions = self.repository.history("source", "example-paper")
        self.assertEqual(len(revisions), 3)
        self.assertEqual(self.repository.read_revision("source", "example-paper", revisions[-1].commit), stored)

        restored = self.repository.restore_revision(
            "source",
            "example-paper",
            revisions[-1].commit,
            author="Restorer",
            author_email="restorer@example.com",
        )
        self.assertEqual(restored.body, stored.body)
        self.assertEqual(restored.author, "Restorer")
        self.assertEqual(len(self.repository.history("source", "example-paper")), 4)
        self.assertNotEqual(edited.body, restored.body)

    def test_rejects_unsafe_slug(self) -> None:
        with self.assertRaises(ValueError):
            self.repository.path_for("source", "../outside")

    def test_rendered_page_round_trips_quoted_metadata(self) -> None:
        page = WikiPage(
            page_type="concept",
            slug="quoted-metadata",
            title='A "quoted" concept',
            author="Researcher",
            language="en",
            sources=("raw/papers/a:b.pdf",),
            tags=("concept",),
            body="# Quoted metadata",
        ).with_timestamp()

        self.assertEqual(parse_page(render_page(page)), page)


if __name__ == "__main__":
    unittest.main()
