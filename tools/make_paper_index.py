"""raw/papers 목록 파일을 생성한다.

PDF 자체는 git에 올리지 않으므로(.gitignore), 어떤 논문을 갖고 있었는지와
그중 무엇이 위키에 반영되었는지를 기록으로 남긴다.

사용법:
    python tools/make_paper_index.py

출력:
    raw/papers/INDEX.md
"""

from __future__ import annotations

import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAPERS = ROOT / "raw" / "papers"
OUT = PAPERS / "INDEX.md"
PAGE_DIRS = ("sources", "concepts", "comparisons", "claims", "questions")


def read_frontmatter(path: Path) -> dict:
    """의존성 없이 필요한 필드만 훑는다. YAML 파서를 쓰지 않는다."""
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return {}
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    block = text[3:end]
    out: dict = {"sources": []}
    in_sources = False
    for line in block.splitlines():
        if re.match(r"^sources:\s*$", line):
            in_sources = True
            continue
        if in_sources:
            m = re.match(r"^\s+-\s+\"?(.+?)\"?\s*$", line)
            if m:
                out["sources"].append(m.group(1))
                continue
            in_sources = False
        m = re.match(r'^(slug|title|type|status):\s*"?(.*?)"?\s*$', line)
        if m:
            out[m.group(1)] = m.group(2)
    return out


def collect_pages() -> dict[str, set[tuple[str, str, str]]]:
    """PDF 파일명 -> {(page_type, slug, status)} 매핑. 중복 제거."""
    index: dict[str, set[tuple[str, str, str]]] = {}
    for d in PAGE_DIRS:
        for page in sorted((ROOT / "wiki" / d).glob("*.md")):
            fm = read_frontmatter(page)
            for src in fm.get("sources", []):
                name = Path(src.replace("\\", "/")).name
                if name.lower().endswith(".pdf"):
                    index.setdefault(name, set()).add(
                        (fm.get("type", d[:-1]), fm.get("slug", page.stem), fm.get("status", "?"))
                    )
    return index


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    if not PAPERS.is_dir():
        print(f"없는 경로: {PAPERS}", file=sys.stderr)
        return 1

    pdfs = sorted(PAPERS.rglob("*.pdf"), key=lambda p: p.name.lower())
    pages = collect_pages()

    lines: list[str] = []
    lines.append("# raw/papers 목록")
    lines.append("")
    lines.append("> PDF 본체는 git에 올리지 않는다(`.gitignore`). 이 파일은 **무엇을 갖고 있었는지의 기록**이다.")
    lines.append("> `python tools/make_paper_index.py`로 다시 만든다. 손으로 고치지 않는다.")
    lines.append("")
    lines.append(f"생성 시각 {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')} · "
                 f"PDF {len(pdfs)}개 · 총 {sum(p.stat().st_size for p in pdfs) / 1024 / 1024:.0f} MB")
    lines.append("")
    lines.append("| 파일 | 크기 | 추가된 날 | 정리 페이지 | 파생 개념 |")
    lines.append("| --- | ---: | --- | --- | ---: |")

    unlinked = 0
    for p in pdfs:
        st = p.stat()
        size = f"{st.st_size / 1024 / 1024:.1f} MB"
        added = datetime.fromtimestamp(st.st_mtime).strftime("%Y-%m-%d")
        hits = pages.get(p.name, set())
        srcs = sorted(s for t, s, _ in hits if t == "source")
        others = sorted({s for t, s, _ in hits if t != "source"})
        if srcs:
            mark = ", ".join(f"`{s}`" for s in srcs)
        elif others:
            mark = "정리 페이지 없음"
        else:
            mark = "미반영"
            unlinked += 1
        rel = p.relative_to(PAPERS).as_posix()
        lines.append(f"| {rel} | {size} | {added} | {mark} | {len(others) or ''} |")

    lines.append("")
    lines.append(f"반영됨 {len(pdfs) - unlinked}개 · 미반영 {unlinked}개")
    lines.append("")
    lines.append("미반영은 아직 위키 페이지의 `sources`에 이 PDF 경로가 없다는 뜻이다. "
                 "읽지 않았거나, 읽었으나 경로를 다르게 적었을 수 있다.")
    lines.append("")

    OUT.write_text("\n".join(lines), encoding="utf-8", newline="\n")
    print(f"작성: {OUT.relative_to(ROOT)}  (PDF {len(pdfs)}개, 반영 {len(pdfs) - unlinked}개)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
