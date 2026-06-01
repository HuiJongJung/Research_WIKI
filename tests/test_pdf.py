from __future__ import annotations

from importlib.util import find_spec
from pathlib import Path
import tempfile
import unittest

from research_wiki_mcp.config import AppConfig
from research_wiki_mcp.pdf import PdfExtractor, parse_page_range, validate_reflection_language

HAS_PYMUPDF = find_spec("fitz") is not None


class PageRangeTests(unittest.TestCase):
    def test_defaults_to_all_pages_and_deduplicates(self) -> None:
        self.assertEqual(parse_page_range(None, total_pages=3), (1, 2, 3))
        self.assertEqual(parse_page_range("1-2,2,3", total_pages=3), (1, 2, 3))

    def test_rejects_invalid_ranges(self) -> None:
        for page_range in ("0", "3-2", "1,,2", "a", "1-4"):
            with self.subTest(page_range=page_range):
                with self.assertRaises(ValueError):
                    parse_page_range(page_range, total_pages=3)

    def test_reflection_language_defaults_are_constrained(self) -> None:
        self.assertEqual(validate_reflection_language("ko"), "ko")
        self.assertEqual(validate_reflection_language("en"), "en")
        with self.assertRaises(ValueError):
            validate_reflection_language("ja")


@unittest.skipUnless(HAS_PYMUPDF, "PyMuPDF is required for PDF fixture tests")
class PdfExtractorTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self.temp_dir.name)
        self.pdf_path = self.root / "sample.pdf"
        self._write_pdf_fixture(self.pdf_path)
        self.extractor = PdfExtractor(AppConfig.from_root(self.root))

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_extract_text_uses_selected_pages(self) -> None:
        chunks = self.extractor.extract_text(self.pdf_path, pages="1,3")

        self.assertEqual([chunk.page_number for chunk in chunks], [1, 3])
        self.assertIn("Fixture page 1", chunks[0].text)
        self.assertIn("Fixture page 3", chunks[1].text)
        self.assertEqual(chunks[0].reflection_language, "ko")

    def test_render_screenshots_returns_image_plus_text_artifacts(self) -> None:
        artifacts = self.extractor.render_screenshots(
            self.pdf_path,
            pages="2-3",
            dpi=72,
            reflection_language="en",
        )

        self.assertEqual([artifact.page_number for artifact in artifacts], [2, 3])
        self.assertIn("Fixture page 2", artifacts[0].text)
        self.assertTrue(artifacts[0].image_path.is_file())
        self.assertGreater(artifacts[0].image_path.stat().st_size, 0)
        self.assertEqual(artifacts[0].reflection_language, "en")

    def test_rejects_non_pdf_path(self) -> None:
        text_path = self.root / "not-a-pdf.txt"
        text_path.write_text("not a PDF", encoding="utf-8")

        with self.assertRaises(ValueError):
            self.extractor.extract_text(text_path)

    @staticmethod
    def _write_pdf_fixture(path: Path) -> None:
        import fitz  # type: ignore

        with fitz.open() as document:
            for page_number in range(1, 4):
                page = document.new_page()
                page.insert_text((72, 72), f"Fixture page {page_number}")
            document.save(path)


if __name__ == "__main__":
    unittest.main()
