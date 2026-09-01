#!/usr/bin/env python3
"""wiki/assets/INDEX.md 재생성.

그림 본체는 git에 올리지 않으므로(.gitignore), 무엇을 갖고 있었는지만 남긴다.
raw/papers/INDEX.md와 같은 취지이며 tools/make_paper_index.py와 짝이다.
"""
import datetime
import io
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "wiki", "assets")


def main():
    root = os.path.normpath(ROOT)
    rows, total, nfile = [], 0, 0
    for d in sorted(os.listdir(root)):
        p = os.path.join(root, d)
        if not os.path.isdir(p):
            continue
        fs = sorted(f for f in os.listdir(p) if not f.startswith("."))
        sz = sum(os.path.getsize(os.path.join(p, f)) for f in fs)
        total += sz
        nfile += len(fs)
        rows.append((d, len(fs), sz, fs))

    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M")
    out = [
        "# wiki/assets 목록",
        "",
        "> 그림 본체는 git에 올리지 않는다(`.gitignore`). 이 파일은 **무엇을 갖고 있었는지의 기록**이다.",
        "> 폴더 이름 = 그 그림을 쓰는 위키 페이지 슬러그. 원본은 `raw/papers/`의 해당 논문 PDF에서 다시 crop한다.",
        "> `python tools/make_assets_index.py`로 다시 만든다. 손으로 고치지 않는다.",
        "",
        "생성 시각 %s UTC · 폴더 %d개 · 파일 %d개 · 총 %.0f MB" % (now, len(rows), nfile, total / 1e6),
        "",
        "| 폴더 (= 위키 페이지 슬러그) | 그림 수 | 크기 | 파일 |",
        "| --- | ---: | ---: | --- |",
    ]
    for d, c, sz, fs in rows:
        lst = ", ".join("`%s`" % f for f in fs[:6])
        if len(fs) > 6:
            lst += " … 외 %d" % (len(fs) - 6)
        out.append("| `%s` | %d | %.1f MB | %s |" % (d, c, sz / 1e6, lst))

    io.open(os.path.join(root, "INDEX.md"), "w", encoding="utf-8").write("\n".join(out) + "\n")
    print("wiki/assets/INDEX.md — 폴더 %d, 파일 %d, %.0f MB" % (len(rows), nfile, total / 1e6))


if __name__ == "__main__":
    main()
