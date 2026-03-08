#!/usr/bin/env python3
"""Build a quick impact matrix for changed paths in the primary-school repo.

Usage examples:
  python impact_matrix.py --paths container/src/App.js exam/src/Exam.js
  python impact_matrix.py --git-range HEAD~1..HEAD
  git diff --name-only HEAD~1..HEAD | python impact_matrix.py --stdin
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

MODULES = ("container", "maths-science", "exam", "student-records")


def _normalize_path(path: str, root: Path) -> str:
    p = Path(path)
    if p.is_absolute():
        try:
            return p.resolve().relative_to(root.resolve()).as_posix()
        except ValueError:
            return p.as_posix()
    rel = p.as_posix()
    return rel[2:] if rel.startswith("./") else rel


def _detect_module(relpath: str) -> str:
    first = relpath.split("/", 1)[0]
    if first in MODULES:
        return first
    if relpath.startswith("scripts/"):
        return "root-scripts"
    if relpath.startswith(".vibe/"):
        return "vibe"
    return "root"


def _detect_category(relpath: str) -> str:
    if relpath.endswith((".md", ".txt")):
        return "docs"
    if relpath.endswith((".css", ".scss")):
        return "styles"
    if relpath.endswith((".js", ".jsx", ".ts", ".tsx")):
        return "source"
    if "webpack.config" in relpath or relpath.endswith(
        ("package.json", "package-lock.json")
    ):
        return "build-config"
    if relpath.startswith("scripts/") or "/scripts/" in relpath:
        return "scripts"
    return "other"


def _paths_from_git_range(git_range: str, root: Path) -> list[str]:
    cmd = ["git", "-C", str(root), "diff", "--name-only", git_range]
    proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or "git diff failed")
    return [line.strip() for line in proc.stdout.splitlines() if line.strip()]


def _paths_from_stdin() -> list[str]:
    return [line.strip() for line in sys.stdin if line.strip()]


def build_matrix(paths: list[str], root: Path) -> dict[str, dict[str, object]]:
    matrix: dict[str, dict[str, object]] = {}
    by_module = defaultdict(list)
    by_category = defaultdict(set)

    normalized = [_normalize_path(p, root) for p in paths]
    for rel in normalized:
        mod = _detect_module(rel)
        cat = _detect_category(rel)
        by_module[mod].append(rel)
        by_category[mod].add(cat)

    for mod, files in sorted(by_module.items()):
        matrix[mod] = {
            "file_count": len(files),
            "categories": sorted(by_category[mod]),
            "files": sorted(files),
        }
    return matrix


def _print_table(matrix: dict[str, dict[str, object]]) -> None:
    if not matrix:
        print("No paths provided.")
        return

    print("Impact Matrix")
    print("=============")
    for mod, entry in matrix.items():
        cats = ", ".join(entry["categories"])  # type: ignore[index]
        count = entry["file_count"]  # type: ignore[index]
        print(f"- {mod}: {count} file(s) [{cats}]")
        for f in entry["files"]:  # type: ignore[index]
            print(f"  - {f}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate module impact matrix")
    parser.add_argument("--root", default=".", help="Repository root path")
    parser.add_argument("--git-range", help="git range (e.g. HEAD~1..HEAD)")
    parser.add_argument(
        "--stdin", action="store_true", help="Read newline-delimited paths from stdin"
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON output")
    parser.add_argument(
        "--paths", nargs="*", default=[], help="One or more relative/absolute paths"
    )
    args = parser.parse_args()

    root = Path(args.root).resolve()
    paths = list(args.paths)

    try:
        if args.git_range:
            paths.extend(_paths_from_git_range(args.git_range, root))
        if args.stdin:
            paths.extend(_paths_from_stdin())
    except RuntimeError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2

    matrix = build_matrix(paths, root)

    if args.json:
        print(json.dumps(matrix, indent=2, sort_keys=True))
    else:
        _print_table(matrix)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
