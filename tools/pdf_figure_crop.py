#!/usr/bin/env python3
"""pdf_figure_crop.py — crop specific figures/tables out of a paper PDF.

The Research_WIKI source pages used to embed whole PDF pages
(``page-0007-dpi-144.png``), which drags in headers, body text, and unrelated
figures. This tool lets you (1) render a page with a fractional coordinate grid
so you can eyeball a figure's bounding box, then (2) crop just that region at
high DPI into ``wiki/assets/<slug>/<name>.png``.

Coordinates are FRACTIONAL (0..1) of the page, origin at the TOP-LEFT:
    x0,y0 = top-left corner, x1,y1 = bottom-right corner.

Usage
-----
Inspect a page (grid overlay every 0.05, thicker/labelled every 0.10):
    python tools/pdf_figure_crop.py grid \
        --pdf "raw/papers/Triangle Splatting.pdf" --page 7 \
        --out "<scratch>/grid_p7.png"

Crop a figure once you know the box:
    python tools/pdf_figure_crop.py crop \
        --pdf "raw/papers/Triangle Splatting.pdf" --page 7 \
        --bbox 0.06,0.10,0.94,0.34 --dpi 220 \
        --out "wiki/assets/triangle-splatting/table1-benchmarks.png"

Notes
-----
* ``--page`` is 1-indexed (matches the paper's printed page order in the file).
* ``grid`` defaults to a low DPI (fast, small) since it is throwaway.
* ``crop`` defaults to a high DPI (crisp figures for the wiki).
* A thin border is drawn around crops so pasted-in figures read as figures.
"""
from __future__ import annotations

import argparse
import os
import sys

import fitz  # PyMuPDF
from PIL import Image, ImageDraw, ImageFont


def _render_page(pdf_path: str, page_1indexed: int, dpi: int) -> Image.Image:
    doc = fitz.open(pdf_path)
    if not (1 <= page_1indexed <= doc.page_count):
        raise SystemExit(
            f"page {page_1indexed} out of range (PDF has {doc.page_count} pages)"
        )
    page = doc.load_page(page_1indexed - 1)
    zoom = dpi / 72.0
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    doc.close()
    return img


def _load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for name in ("arial.ttf", "DejaVuSans.ttf", "LiberationSans-Regular.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def cmd_grid(args: argparse.Namespace) -> None:
    img = _render_page(args.pdf, args.page, args.dpi)
    w, h = img.size
    draw = ImageDraw.Draw(img)
    font = _load_font(max(12, args.dpi // 8))

    # minor lines every 0.05, major (labelled) every 0.10
    step = 0.05
    n = int(round(1.0 / step))
    for i in range(n + 1):
        frac = i * step
        major = abs((frac * 10) - round(frac * 10)) < 1e-6 and round(frac * 10) % 1 == 0
        x = int(frac * (w - 1))
        y = int(frac * (h - 1))
        color = (220, 40, 40) if major else (120, 170, 255)
        width = 2 if major else 1
        draw.line([(x, 0), (x, h)], fill=color, width=width)
        draw.line([(0, y), (w, y)], fill=color, width=width)
        if major:
            label = f"{frac:.1f}"
            draw.text((x + 2, 2), label, fill=(200, 0, 0), font=font)
            draw.text((2, y + 2), label, fill=(200, 0, 0), font=font)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    img.save(args.out)
    print(f"grid saved: {args.out}  ({w}x{h}px @ {args.dpi}dpi)")
    print("read off bbox as fractional x0,y0,x1,y1 (top-left origin)")


def _parse_bbox(s: str) -> tuple[float, float, float, float]:
    parts = [p.strip() for p in s.split(",")]
    if len(parts) != 4:
        raise SystemExit("--bbox must be 'x0,y0,x1,y1' fractional values")
    x0, y0, x1, y1 = (float(p) for p in parts)
    if not (0 <= x0 < x1 <= 1 and 0 <= y0 < y1 <= 1):
        raise SystemExit("bbox must satisfy 0<=x0<x1<=1 and 0<=y0<y1<=1")
    return x0, y0, x1, y1


def cmd_crop(args: argparse.Namespace) -> None:
    x0, y0, x1, y1 = _parse_bbox(args.bbox)
    img = _render_page(args.pdf, args.page, args.dpi)
    w, h = img.size
    box = (int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h))
    crop = img.crop(box)
    if args.border:
        bordered = Image.new("RGB", (crop.width + 2, crop.height + 2), (210, 210, 210))
        bordered.paste(crop, (1, 1))
        crop = bordered
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    crop.save(args.out)
    print(f"crop saved: {args.out}  ({crop.width}x{crop.height}px @ {args.dpi}dpi)")


def main(argv: list[str]) -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    g = sub.add_parser("grid", help="render a page with a fractional coordinate grid")
    g.add_argument("--pdf", required=True)
    g.add_argument("--page", type=int, required=True, help="1-indexed page number")
    g.add_argument("--out", required=True)
    g.add_argument("--dpi", type=int, default=120)
    g.set_defaults(func=cmd_grid)

    c = sub.add_parser("crop", help="crop a fractional bbox out of a page")
    c.add_argument("--pdf", required=True)
    c.add_argument("--page", type=int, required=True, help="1-indexed page number")
    c.add_argument("--bbox", required=True, help="fractional x0,y0,x1,y1 (top-left origin)")
    c.add_argument("--out", required=True)
    c.add_argument("--dpi", type=int, default=220)
    c.add_argument("--no-border", dest="border", action="store_false")
    c.set_defaults(border=True, func=cmd_crop)

    args = p.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main(sys.argv[1:])
