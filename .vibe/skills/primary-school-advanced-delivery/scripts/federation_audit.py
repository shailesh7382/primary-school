#!/usr/bin/env python3
"""Audit Module Federation config across primary-school modules."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

MODULES = ("container", "maths-science", "exam", "student-records")

NAME_RE = re.compile(r"name:\s*['\"]([^'\"]+)['\"]")
REMOTE_KEY_RE = re.compile(r"^\s*([a-zA-Z0-9_]+)\s*:\s*[^,\n]+,?\s*$")
EXPOSE_KEY_RE = re.compile(r"^\s*['\"](\./[^'\"]+)['\"]\s*:")
ENTRY_RE = re.compile(r"remoteEntry\.js")


def _extract_block(text: str, key: str) -> list[str]:
    start = text.find(f"{key}:")
    if start == -1:
        return []

    brace_start = text.find("{", start)
    if brace_start == -1:
        return []

    depth = 0
    out = []
    for idx in range(brace_start, len(text)):
        ch = text[idx]
        if ch == "{":
            depth += 1
            continue
        if ch == "}":
            depth -= 1
            if depth == 0:
                break
            continue
        if depth >= 1:
            out.append(ch)
    return "".join(out).splitlines()


def _parse_module(cfg_path: Path) -> dict[str, object]:
    text = cfg_path.read_text(encoding="utf-8")
    mf_enabled = "ModuleFederationPlugin" in text
    names = NAME_RE.findall(text)

    remotes = []
    for line in _extract_block(text, "remotes"):
        m = REMOTE_KEY_RE.match(line)
        if m:
            remotes.append(m.group(1))

    exposes = []
    for line in _extract_block(text, "exposes"):
        m = EXPOSE_KEY_RE.search(line)
        if m:
            exposes.append(m.group(1))

    return {
        "path": cfg_path.as_posix(),
        "module_federation": mf_enabled,
        "name": names[0] if names else None,
        "remotes": sorted(set(remotes)),
        "exposes": sorted(set(exposes)),
        "contains_remote_entry": bool(ENTRY_RE.search(text)),
    }


def _lint(results: dict[str, dict[str, object]]) -> list[str]:
    warnings: list[str] = []
    container = results.get("container")
    expected_remotes = {"mathsScience", "exam", "studentRecords"}

    if container:
        actual = set(container["remotes"])  # type: ignore[index]
        missing = sorted(expected_remotes - actual)
        if missing:
            warnings.append(f"container remotes missing: {', '.join(missing)}")
    else:
        warnings.append("container webpack config not found")

    for module in ("maths-science", "exam", "student-records"):
        entry = results.get(module)
        if not entry:
            warnings.append(f"{module} webpack config not found")
            continue
        if not entry["exposes"]:  # type: ignore[index]
            warnings.append(f"{module} has no exposes block entries")

    return warnings


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit webpack module federation setup")
    parser.add_argument("--root", default=".", help="Repository root")
    parser.add_argument("--json", action="store_true", help="Output JSON")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    results: dict[str, dict[str, object]] = {}
    for module in MODULES:
        cfg = root / module / "webpack.config.js"
        if cfg.is_file():
            results[module] = _parse_module(cfg)

    warnings = _lint(results)
    payload = {"modules": results, "warnings": warnings}

    if args.json:
        print(json.dumps(payload, indent=2, sort_keys=True))
        return 0

    print("Federation Audit")
    print("================")
    for module in MODULES:
        if module not in results:
            print(f"- {module}: missing webpack.config.js")
            continue
        entry = results[module]
        print(f"- {module}:")
        print(f"  name: {entry['name']}")
        print(f"  module_federation: {entry['module_federation']}")
        print(f"  remotes: {', '.join(entry['remotes']) or '-'}")
        print(f"  exposes: {', '.join(entry['exposes']) or '-'}")

    if warnings:
        print("\nWarnings")
        print("--------")
        for w in warnings:
            print(f"- {w}")
        return 1

    print("\nNo warnings.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
