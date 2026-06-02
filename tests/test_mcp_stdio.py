from __future__ import annotations

import json
from pathlib import Path
import sys
import tempfile
import unittest

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


class McpStdioSmokeTests(unittest.IsolatedAsyncioTestCase):
    async def test_stdio_lists_primitives_and_calls_rebuild(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            params = StdioServerParameters(
                command=sys.executable,
                args=["-m", "research_wiki_mcp.server", "--root", temp_dir],
                cwd=str(Path.cwd()),
            )
            async with stdio_client(params) as (read, write):
                async with ClientSession(read, write) as session:
                    await session.initialize()
                    tool_names = {tool.name for tool in (await session.list_tools()).tools}
                    prompt_names = {prompt.name for prompt in (await session.list_prompts()).prompts}
                    resource_uris = {str(resource.uri) for resource in (await session.list_resources()).resources}
                    template_uris = {
                        template.uriTemplate for template in (await session.list_resource_templates()).resourceTemplates
                    }

                    self.assertIn("wiki_search", tool_names)
                    self.assertIn("wiki_save_page", tool_names)
                    self.assertIn("pdf_extract_text", tool_names)
                    self.assertIn("paper_ingest_workflow", prompt_names)
                    self.assertIn("wiki://index", resource_uris)
                    self.assertIn("wiki://page/{page_type}/{slug}", template_uris)

                    rebuild = await session.call_tool("wiki_rebuild_index")
                    self.assertFalse(rebuild.isError)
                    self.assertEqual(json.loads(rebuild.content[0].text)["count"], 0)

                    index_resource = await session.read_resource("wiki://index")
                    payload = json.loads(index_resource.contents[0].text)
                    self.assertEqual(payload, {"pages": []})

                    prompt = await session.get_prompt(
                        "paper_ingest_workflow",
                        {"pdf_path": "paper.pdf", "reflection_language": "ko"},
                    )
                    self.assertIn("한국어", prompt.messages[0].content.text)

    async def test_stdio_omits_disabled_startup_capability(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            settings_path = Path(temp_dir) / "mcp-settings.json"
            settings_path.write_text(
                json.dumps({"schema_version": 1, "capabilities": {"tool:pdf_extract_text": False}}),
                encoding="utf-8",
            )
            params = StdioServerParameters(
                command=sys.executable,
                args=["-m", "research_wiki_mcp.server", "--root", temp_dir],
                cwd=str(Path.cwd()),
            )
            async with stdio_client(params) as (read, write):
                async with ClientSession(read, write) as session:
                    await session.initialize()
                    tool_names = {tool.name for tool in (await session.list_tools()).tools}
                    self.assertNotIn("pdf_extract_text", tool_names)
                    self.assertIn("wiki_search", tool_names)


if __name__ == "__main__":
    unittest.main()
