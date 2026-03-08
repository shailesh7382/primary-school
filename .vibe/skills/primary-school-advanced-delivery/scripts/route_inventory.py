#!/usr/bin/env python3
"""Inventory route definitions and navigation calls by module."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

MODULES = ("container", "maths-science", "exam", "student-records")
SRC_EXTS = (".js", ".jsx", ".ts", ".tsx")

ROUTE_RE = re.compile(r"<Route[^>]*\bpath\s*=\s*['\"]([^'\"]+)['\"]", re.MULTILINE)
NAV_RE = re.compile(r"navigate\(\s*['\"]([^'\"]+)['\"]")
LINK_RE = re.compile(r"\bto\s*=\s*['\"]([^'\"]+)['\"]")


def _collect_from_file(path: Path) -> dict[str, list[str]]:
    text = path.read_text(encoding="utf-8", errors="replace")
    routes = sorted(set(ROUTE_RE.findall(text)))
    navs = sorted(set(NAV_RE.findall(text)))
    links = sorted(set(LINK_RE.findall(text)))
    return {"routes": routes, "navigate_calls": navs, "link_targets": links}


def _collect_module(root: Path, module: str) -> dict[str, object]:
    src = root / module / "src"
    files = [p for p in src.rglob("*") if p.suffix in SRC_EXTS]
    aggregate = {
        "routes": set(),
        "navigate_calls": set(),
        "link_targets": set(),
        "files_scanned": len(files),
    }

    for f in files:
        file_data = _collect_from_file(f)
        aggregate["routes"].update(file_data["routes"])
        aggregate["navigate_calls"].update(file_data["navigate_calls"])
        aggregate["link_targets"].update(file_data["link_targets"])

    return {
        "files_scanned": aggregate["files_scanned"],
        "routes": sorted(aggregate["routes"]),
        "navigate_calls": sorted(aggregate["navigate_calls"]),
        "link_targets": sorted(aggregate["link_targets"]),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Inventory route/navigation usage")
    parser.add_argument("--root", default=".", help="Repository root")
    parser.add_argument("--json", action="store_true", help="Output JSON")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    payload: dict[str, dict[str, object]] = {}
    for module in MODULES:
        if (root / module / "src").is_dir():
            payload[module] = _collect_module(root, module)

    if args.json:
        print(json.dumps(payload, indent=2, sort_keys=True))
        return 0

    print("Route Inventory")
    print("===============")
    for module in MODULES:
        if module not in payload:
            continue
        data = payload[module]
        print(f"- {module} (files_scanned={data['files_scanned']})")
        print(f"  routes: {', '.join(data['routes']) or '-'}")
        print(f"  navigate_calls: {', '.join(data['navigate_calls']) or '-'}")
        print(f"  link_targets: {', '.join(data['link_targets']) or '-'}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
