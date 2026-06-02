from __future__ import annotations

import subprocess
import tempfile
import unittest
from pathlib import Path

from starlette.testclient import TestClient

from research_wiki_mcp.config import AppConfig
from research_wiki_mcp.gui import create_gui_app

try:
    import fitz
except ImportError:  # pragma: no cover
    fitz = None


class GuiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self.temp_dir.name)
        subprocess.run(["git", "init", "-q"], cwd=self.root, check=True)
        self.config = AppConfig.from_root(self.root)
        self.client = TestClient(create_gui_app(self.config))

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_dashboard_save_read_review_and_rebuild(self) -> None:
        homepage = self.client.get("/")
        self.assertEqual(homepage.status_code, 200)
        self.assertIn("연구 지식 대시보드", homepage.text)
        self.assertIn('data-range-mode="all">전체 읽기</button>', homepage.text)
        self.assertIn('data-nav-view="papers"', homepage.text)
        self.assertIn('data-nav-view="pages"', homepage.text)
        self.assertIn('id="pageTypeFilters"', homepage.text)
        self.assertIn('id="paperFilter"', homepage.text)
        self.assertIn(".page-section-focus .page-list", homepage.text)
        self.assertIn('data-nav-view="mcp"', homepage.text)
        self.assertIn('id="mcpStatusSection"', homepage.text)
        self.assertIn('id="mcpSettingsForm"', homepage.text)
        self.assertIn("[hidden] { display: none !important; }", homepage.text)
        self.assertNotIn("WORKFLOW", homepage.text)
        self.assertNotIn("data-open-tab", homepage.text)
        self.assertIn('id="workbenchToggle"', homepage.text)
        self.assertIn('id="workbenchClose"', homepage.text)
        self.assertIn(".shell.workbench-closed", homepage.text)
        self.assertIn('id="pageDetailSection"', homepage.text)
        self.assertIn('id="sourceRegisterButton"', homepage.text)
        self.assertIn('<input id="pageStatus" type="hidden" value="draft">', homepage.text)
        self.assertIn('type="submit">저장</button>', homepage.text)
        self.assertIn('id="reviewButton">검토 완료로 표시</button>', homepage.text)
        self.assertNotIn("<label>상태<select", homepage.text)

        dashboard = self.client.get("/api/dashboard").json()
        self.assertEqual(dashboard["stats"]["pages"], 0)
        self.assertEqual(dashboard["languages"], ["ko", "en"])

        mcp_status = self.client.get("/api/mcp/status")
        self.assertEqual(mcp_status.status_code, 200)
        self.assertEqual(mcp_status.json()["counts"], {"total": 19, "enabled": 19, "disabled": 0})
        self.assertIn("tool:pdf_extract_text", {
            capability["key"] for capability in mcp_status.json()["capabilities"]
        })

        mcp_saved = self.client.post(
            "/api/mcp/settings",
            json={"capabilities": {"tool:pdf_extract_text": False}},
        )
        self.assertEqual(mcp_saved.status_code, 200)
        self.assertEqual(mcp_saved.json()["counts"], {"total": 19, "enabled": 18, "disabled": 1})

        saved = self.client.post(
            "/api/pages",
            json={
                "page_type": "concept",
                "slug": "visibility-buffer",
                "title": "가시성 버퍼",
                "author": "tester",
                "author_email": "tester@example.local",
                "body": "가시성 변화량을 보조 신호로 사용한다.",
                "language": "ko",
                "tags": ["rendering"],
            },
        )
        self.assertEqual(saved.status_code, 200)
        self.assertEqual(saved.json()["status"], "draft")

        page = self.client.get("/api/pages/concept/visibility-buffer")
        self.assertEqual(page.status_code, 200)
        self.assertEqual(page.json()["title"], "가시성 버퍼")

        reviewed = self.client.post(
            "/api/pages/concept/visibility-buffer/review",
            json={"author": "reviewer", "author_email": "reviewer@example.local"},
        )
        self.assertEqual(reviewed.status_code, 200)
        self.assertEqual(reviewed.json()["status"], "reviewed")

        rebuilt = self.client.post("/api/index/rebuild")
        self.assertEqual(rebuilt.status_code, 200)
        self.assertEqual(rebuilt.json(), {"rebuilt": 1, "count": 1})

    @unittest.skipUnless(fitz, "PyMuPDF is required for GUI PDF previews")
    def test_pdf_preview_supports_text_and_screenshot_modes(self) -> None:
        pdf_path = self.config.raw_papers_root / "sample.pdf"
        pdf_path.parent.mkdir(parents=True, exist_ok=True)
        document = fitz.open()
        page = document.new_page()
        page.insert_text((72, 72), "local gui preview")
        document.save(pdf_path)
        document.close()

        text_preview = self.client.post(
            "/api/pdf/preview",
            json={
                "pdf_path": str(pdf_path),
                "reading_mode": "text",
                "pages": "1",
                "reflection_language": "en",
            },
        )
        self.assertEqual(text_preview.status_code, 200)
        self.assertIn("local gui preview", text_preview.json()["artifacts"][0]["text"])
        self.assertEqual(text_preview.json()["artifacts"][0]["pdf_name"], "sample.pdf")

        registered = self.client.post(
            "/api/pdf/register-source",
            json={
                "pdf_path": str(pdf_path),
                "title": "Sample Paper",
                "slug": "sample-paper",
                "author": "tester",
                "author_email": "tester@example.local",
                "reading_mode": "text",
                "reflection_language": "ko",
            },
        )
        self.assertEqual(registered.status_code, 200)
        self.assertEqual(registered.json()["slug"], "sample-paper")
        self.assertIn("local gui preview", registered.json()["body"])
        paper = self.client.get("/api/dashboard").json()["papers"][0]
        self.assertEqual(paper["state"], "source-draft")
        self.assertEqual(paper["color"], "amber")

        screenshot_preview = self.client.post(
            "/api/pdf/preview",
            json={
                "pdf_path": str(pdf_path),
                "reading_mode": "screenshot",
                "pages": "1",
                "reflection_language": "ko",
            },
        )
        self.assertEqual(screenshot_preview.status_code, 200)
        image_url = screenshot_preview.json()["artifacts"][0]["image_url"]
        image = self.client.get(image_url)
        self.assertEqual(image.status_code, 200)
        self.assertEqual(image.headers["content-type"], "image/png")

        screenshot_registered = self.client.post(
            "/api/pdf/register-source",
            json={
                "pdf_path": str(pdf_path),
                "title": "Sample Paper",
                "slug": "sample-paper",
                "author": "tester",
                "author_email": "tester@example.local",
                "reading_mode": "screenshot",
                "pages": "1",
                "dpi": 72,
                "reflection_language": "ko",
            },
        )
        self.assertEqual(screenshot_registered.status_code, 200)
        markdown_image = "![PDF page 1](../assets/sample-paper/page-0001-dpi-72.png)"
        self.assertIn(markdown_image, screenshot_registered.json()["body"])
        wiki_image = self.client.get("/assets/wiki/sample-paper/page-0001-dpi-72.png")
        self.assertEqual(wiki_image.status_code, 200)
        self.assertEqual(wiki_image.headers["content-type"], "image/png")


if __name__ == "__main__":
    unittest.main()
