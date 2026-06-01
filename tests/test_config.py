from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from research_wiki_mcp.config import AppConfig, WIKI_PAGE_TYPES


class AppConfigTests(unittest.TestCase):
    def test_workspace_layout_and_defaults(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            config = AppConfig.from_root(temp_dir)

            config.ensure_workspace_layout()

            self.assertEqual(config.shared_token_env, "RESEARCH_WIKI_MCP_TOKEN")
            self.assertEqual(config.http_host, "127.0.0.1")
            self.assertEqual(config.http_port, 8765)
            self.assertEqual(config.index_path, Path(temp_dir) / "data" / "wiki-index.sqlite3")
            self.assertTrue(config.raw_papers_root.is_dir())
            self.assertTrue(config.screenshots_root.is_dir())
            for page_type in WIKI_PAGE_TYPES:
                self.assertTrue((config.wiki_root / page_type).is_dir())


if __name__ == "__main__":
    unittest.main()
