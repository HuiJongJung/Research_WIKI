from __future__ import annotations

import json
from pathlib import Path
import tempfile
import unittest

from research_wiki_mcp.config import AppConfig
from research_wiki_mcp.mcp_catalog import CAPABILITIES, McpSettingsStore


class McpSettingsStoreTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self.temp_dir.name)
        self.store = McpSettingsStore(AppConfig.from_root(self.root))

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_defaults_enable_all_capabilities(self) -> None:
        status = self.store.status()
        self.assertEqual(status["counts"]["total"], len(CAPABILITIES))
        self.assertEqual(status["counts"]["enabled"], len(CAPABILITIES))
        self.assertEqual(status["counts"]["disabled"], 0)

    def test_save_persists_capability_override(self) -> None:
        settings = self.store.save({"tool:pdf_extract_text": False})
        self.assertFalse(settings["tool:pdf_extract_text"])
        payload = json.loads((self.root / "mcp-settings.json").read_text(encoding="utf-8"))
        self.assertFalse(payload["capabilities"]["tool:pdf_extract_text"])
        self.assertFalse(self.store.is_enabled("tool", "pdf_extract_text"))

    def test_save_rejects_unknown_capability(self) -> None:
        with self.assertRaisesRegex(ValueError, "unknown MCP capabilities"):
            self.store.save({"tool:not-real": False})


if __name__ == "__main__":
    unittest.main()
