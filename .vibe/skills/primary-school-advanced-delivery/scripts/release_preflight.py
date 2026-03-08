#!/usr/bin/env python3
"""Run quick repository preflight checks for primary-school releases."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

MODULES = ("container", "maths-science", "exam", "student-records")
REQUIRED_ROOT_SCRIPTS = ("install:all", "build:all", "start:all", "check-status")
REQUIRED_MODULE_SCRIPTS = ("start", "build", "serve")


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def check_root(root: Path) -> list[str]:
    issues: list[str] = []
    pkg = root / "package.json"
    if not pkg.is_file():
        issues.append("missing root package.json")
        return issues

    text = _read_text(pkg)
    for script in REQUIRED_ROOT_SCRIPTS:
        if f'"{script}"' not in text:
            issues.append(f"missing root npm script: {script}")

    scripts_dir = root / "scripts"
    for filename in (
        "install-all.sh",
        "build-all.sh",
        "start-all.sh",
        "stop-all.sh",
        "check-status.sh",
    ):
        if not (scripts_dir / filename).is_file():
            issues.append(f"missing scripts/{filename}")
    return issues


def check_module(root: Path, module: str) -> list[str]:
    issues: list[str] = []
    module_dir = root / module
    if not module_dir.is_dir():
        return [f"missing module directory: {module}"]

    pkg = module_dir / "package.json"
    if not pkg.is_file():
        issues.append(f"{module}: missing package.json")
        return issues

    text = _read_text(pkg)
    for script in REQUIRED_MODULE_SCRIPTS:
        if f'"{script}"' not in text:
            issues.append(f"{module}: missing npm script {script}")

    webpack_cfg = module_dir / "webpack.config.js"
    if not webpack_cfg.is_file():
        issues.append(f"{module}: missing webpack.config.js")
    else:
        wtext = _read_text(webpack_cfg)
        if "ModuleFederationPlugin" not in wtext:
            issues.append(f"{module}: ModuleFederationPlugin not found")
    return issues


def run_preflight(root: Path) -> dict[str, object]:
    issues: list[str] = []
    issues.extend(check_root(root))
    for module in MODULES:
        issues.extend(check_module(root, module))
    return {"ok": len(issues) == 0, "issues": issues}


def main() -> int:
    parser = argparse.ArgumentParser(description="Run quick release preflight checks")
    parser.add_argument("--root", default=".", help="Repository root path")
    parser.add_argument("--json", action="store_true", help="Emit JSON output")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    result = run_preflight(root)

    if args.json:
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0 if result["ok"] else 1

    print("Release Preflight")
    print("=================")
    if result["ok"]:
        print("PASS: baseline checks succeeded.")
        return 0

    print("FAIL: issues found.")
    for issue in result["issues"]:
        print(f"- {issue}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
