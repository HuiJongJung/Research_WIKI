from __future__ import annotations

from dataclasses import replace
from pathlib import Path
import tempfile
import unittest

from research_wiki_mcp.config import AppConfig
from research_wiki_mcp.index import WikiIndex
from research_wiki_mcp.models import WikiPage
from research_wiki_mcp.repository import PageRepository


class WikiIndexTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.config = AppConfig.from_root(self.temp_dir.name)
        self.repository = PageRepository(self.config)
        self.index = WikiIndex(self.config)
        self.author_email = "researcher@example.com"

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_rebuild_search_filters_and_recovery(self) -> None:
        source = self.repository.save(
            WikiPage(
                page_type="source",
                slug="visibility-paper",
                title="Visibility Paper",
                author="Researcher",
                confidence="medium",
                sources=("raw/papers/visibility.pdf",),
                tags=("rendering", "visibility"),
                body="# Visibility Paper\n\nShadow boundary guidance.",
            ),
            author_email=self.author_email,
        )
        self.repository.save(
            WikiPage(
                page_type="concept",
                slug="adaptive-sampling",
                title="Adaptive Sampling",
                author="Researcher",
                confidence="high",
                language="en",
                tags=("rendering", "sampling"),
                body="# Adaptive Sampling\n\nAllocate samples where variance is high.",
            ),
            author_email=self.author_email,
        )

        self.assertEqual(self.index.rebuild(), 2)
        self.assertEqual(self.index.count(), 2)
        self.assertEqual([item.slug for item in self.index.search("shadow")], ["visibility-paper"])
        self.assertEqual([item.slug for item in self.index.search(tag="sampling")], ["adaptive-sampling"])
        self.assertEqual([item.slug for item in self.index.search(page_type="source")], ["visibility-paper"])
        self.assertEqual([item.slug for item in self.index.search(language="en")], ["adaptive-sampling"])

        self.repository.save(
            replace(source, body="# Visibility Paper\n\nTemporal reuse evidence."),
            author_email=self.author_email,
        )
        self.assertEqual([item.slug for item in self.index.search("shadow")], ["visibility-paper"])

        self.index.rebuild()
        self.assertEqual(self.index.search("shadow"), [])
        self.assertEqual([item.slug for item in self.index.search("temporal reuse")], ["visibility-paper"])

        Path(self.config.index_path).unlink()
        self.assertEqual(self.index.rebuild(), 2)
        self.assertEqual(self.index.count(), 2)

    def test_rebuild_rejects_filename_slug_mismatch(self) -> None:
        path = self.config.wiki_root / "concepts" / "wrong-name.md"
        path.write_text(
            """---
type: "concept"
slug: "right-name"
title: "Right Name"
status: "draft"
modified_at: "2026-06-01T00:00:00+00:00"
author: "Researcher"
language: "ko"
confidence: "low"
sources:
tags:
---

# Right Name
""",
            encoding="utf-8",
        )

        with self.assertRaises(ValueError):
            self.index.rebuild()

    def test_rebuild_includes_root_wiki_index(self) -> None:
        (self.config.wiki_root / "index.md").write_text(
            """---
type: "system"
slug: "index"
title: "Research WIKI Index"
status: "draft"
modified_at: "2026-06-01T00:00:00+00:00"
author: "system"
language: "ko"
confidence: "high"
sources:
tags:
  - "index"
---

# Research WIKI Index
""",
            encoding="utf-8",
        )

        self.assertEqual(self.index.rebuild(), 1)
        self.assertEqual([item.slug for item in self.index.search(tag="index")], ["index"])


if __name__ == "__main__":
    unittest.main()
