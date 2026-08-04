from zipfile import ZipFile
from pathlib import Path
import html
import re
import sys


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ppt = Path(sys.argv[1])
    with ZipFile(ppt) as z:
        slides = sorted(
            [n for n in z.namelist() if re.match(r"ppt/slides/slide\d+\.xml$", n)],
            key=lambda n: int(re.search(r"slide(\d+)", n).group(1)),
        )
        for n in slides:
            xml = z.read(n).decode("utf-8", errors="ignore")
            texts = [html.unescape(t) for t in re.findall(r"<a:t>(.*?)</a:t>", xml)]
            print(f"\n--- {Path(n).stem} ---")
            for t in texts:
                print(t)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
