#!/usr/bin/env python3
"""Dependency-free validation for the static API documentation."""

from html.parser import HTMLParser
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
CONFLICT_MARKER = re.compile(r"^(<<<<<<<|=======|>>>>>>>)", re.MULTILINE)


def main() -> None:
    html_files = sorted(ROOT.rglob("*.html"))
    yaml_files = sorted(ROOT.rglob("*.yaml"))
    checked_files = html_files + yaml_files
    if not html_files or not yaml_files:
        raise SystemExit("expected HTML and OpenAPI YAML documentation")

    parser = HTMLParser()
    for path in checked_files:
        content = path.read_text(encoding="utf-8")
        if not content.strip():
            raise SystemExit(f"empty file: {path.relative_to(ROOT)}")
        if CONFLICT_MARKER.search(content):
            raise SystemExit(f"merge conflict marker: {path.relative_to(ROOT)}")
        if path.suffix == ".html":
            parser.feed(content)

    print(f"validated {len(html_files)} HTML and {len(yaml_files)} YAML files")


if __name__ == "__main__":
    main()
