from __future__ import annotations

import asyncio
import os
import socket
import subprocess
import sys
import tempfile
import unittest

import httpx
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

from research_wiki_mcp.config import AppConfig
from research_wiki_mcp.server import load_shared_token


class SharedTokenTests(unittest.TestCase):
    def test_load_shared_token_requires_configured_environment(self) -> None:
        config = AppConfig.from_root(".")
        with self.assertRaises(RuntimeError):
            load_shared_token(config, {})
        self.assertEqual(load_shared_token(config, {config.shared_token_env: "secret"}), "secret")


class McpHttpSmokeTests(unittest.IsolatedAsyncioTestCase):
    async def test_streamable_http_requires_token_and_serves_mcp(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            port = self._available_port()
            token = "test-shared-token"
            env = {**os.environ, "RESEARCH_WIKI_MCP_TOKEN": token}
            process = subprocess.Popen(
                [
                    sys.executable,
                    "-m",
                    "research_wiki_mcp.server",
                    "--transport",
                    "streamable-http",
                    "--host",
                    "127.0.0.1",
                    "--port",
                    str(port),
                    "--root",
                    temp_dir,
                ],
                env=env,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            try:
                url = f"http://127.0.0.1:{port}/mcp"
                await self._wait_until_ready(url, process)
                async with httpx.AsyncClient() as client:
                    self.assertEqual((await client.get(url)).status_code, 401)
                    self.assertEqual(
                        (await client.get(url, headers={"Authorization": "Bearer wrong"})).status_code,
                        401,
                    )

                async with httpx.AsyncClient(headers={"Authorization": f"Bearer {token}"}) as http_client:
                    async with streamable_http_client(url, http_client=http_client) as (read, write, _):
                        async with ClientSession(read, write) as session:
                            await session.initialize()
                            tool_names = {tool.name for tool in (await session.list_tools()).tools}
                            self.assertIn("wiki_rebuild_index", tool_names)
                            rebuild = await session.call_tool("wiki_rebuild_index")
                            self.assertFalse(rebuild.isError)
            finally:
                process.terminate()
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=10)

    @staticmethod
    async def _wait_until_ready(url: str, process: subprocess.Popen) -> None:
        async with httpx.AsyncClient() as client:
            for _ in range(100):
                if process.poll() is not None:
                    raise RuntimeError(f"HTTP MCP server exited with code {process.returncode}")
                try:
                    if (await client.get(url)).status_code == 401:
                        return
                except httpx.HTTPError:
                    pass
                await asyncio.sleep(0.1)
        raise TimeoutError("HTTP MCP server did not become ready")

    @staticmethod
    def _available_port() -> int:
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            return sock.getsockname()[1]


if __name__ == "__main__":
    unittest.main()
