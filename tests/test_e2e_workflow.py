from __future__ import annotations

import json
from pathlib import Path
import sys
import tempfile
import unittest

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

try:
    import fitz
except ImportError:  # pragma: no cover
    fitz = None


@unittest.skipUnless(fitz, "PyMuPDF is required for end-to-end PDF workflow validation")
class McpWorkflowEndToEndTests(unittest.IsolatedAsyncioTestCase):
    async def test_pdf_reflection_comparison_review_and_search(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            paper_path = root / "raw" / "papers" / "sample.pdf"
            paper_path.parent.mkdir(parents=True)
            document = fitz.open()
            page = document.new_page()
            page.insert_text((72, 72), "Visibility guidance for Monte Carlo denoising.")
            document.save(paper_path)
            document.close()

            params = StdioServerParameters(
                command=sys.executable,
                args=["-m", "research_wiki_mcp.server", "--root", str(root)],
                cwd=str(Path.cwd()),
            )
            async with stdio_client(params) as (read, write):
                async with ClientSession(read, write) as session:
                    await session.initialize()

                    extracted = await self._call(
                        session,
                        "pdf_extract_text",
                        {"pdf_path": str(paper_path), "reflection_language": "ko"},
                    )
                    self.assertIn("Visibility guidance", extracted[0]["text"])
                    self.assertEqual(extracted[0]["reflection_language"], "ko")

                    await self._save_page(session, "source", "sample-paper", "Sample Paper")
                    self.assertEqual((await self._papers(session))[0]["color"], "amber")

                    await self._save_page(session, "concept", "visibility-guidance", "Visibility Guidance")
                    reflected = (await self._papers(session))[0]
                    self.assertEqual(reflected["color"], "blue")
                    self.assertFalse(reflected["comparison_badge"])

                    await self._save_page(session, "comparison", "visibility-comparison", "Visibility Comparison")
                    compared = (await self._papers(session))[0]
                    self.assertTrue(compared["comparison_badge"])

                    reviewed = await self._call(
                        session,
                        "wiki_review_page",
                        {
                            "page_type": "source",
                            "slug": "sample-paper",
                            "author": "Reviewer",
                            "author_email": "reviewer@example.local",
                        },
                    )
                    self.assertEqual(reviewed["status"], "reviewed")

                    search = await self._call(
                        session,
                        "wiki_search",
                        {"query": "visibility", "page_type": "concept"},
                    )
                    self.assertEqual([item["slug"] for item in search], ["visibility-guidance"])

                    rebuilt = await self._call(session, "wiki_rebuild_index", {})
                    self.assertEqual(rebuilt["count"], 3)

    async def _save_page(self, session: ClientSession, page_type: str, slug: str, title: str) -> None:
        await self._call(
            session,
            "wiki_save_page",
            {
                "page_type": page_type,
                "slug": slug,
                "title": title,
                "author": "Codex",
                "author_email": "codex@example.local",
                "body": f"# {title}\n\nVisibility guidance evidence.",
                "language": "ko",
                "sources": ["raw/papers/sample.pdf"],
                "tags": ["visibility"],
            },
        )

    @staticmethod
    async def _papers(session: ClientSession) -> list[dict]:
        resource = await session.read_resource("wiki://papers")
        return json.loads(resource.contents[0].text)["papers"]

    @staticmethod
    async def _call(session: ClientSession, tool: str, arguments: dict) -> object:
        result = await session.call_tool(tool, arguments)
        if result.isError:
            raise AssertionError(result.content[0].text)
        if result.structuredContent is not None:
            return result.structuredContent.get("result", result.structuredContent)
        return json.loads(result.content[0].text)


if __name__ == "__main__":
    unittest.main()
