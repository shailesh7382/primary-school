---
name: primary-school-advanced-delivery
description: Use for complex or high-risk work in this primary-school microfrontend repository, including cross-module features, regressions, refactors, release hardening, and production readiness checks. Provides a strict workflow with task delegation, MCP-first tooling, and verification gates.
compatibility: mistral-vibe CLI in the primary-school repository
user-invocable: true
allowed-tools: read_file grep search_replace write_file bash task todo git_git_status git_git_diff_unstaged git_git_diff_staged git_git_log playwright_browser_snapshot playwright_browser_navigate
metadata:
  repo: primary-school
  maturity: advanced
---

# Primary School Advanced Delivery

## Use This Skill When

- The request touches multiple modules (`container`, `maths-science`, `exam`, `student-records`).
- The root cause is unclear and requires broad investigation.
- The task is risky (auth, routing, data integrity, release reliability).
- You need an actionable plan before implementation.

## Quick Start

1. Run `bash .vibe/skills/primary-school-advanced-delivery/scripts/context_scan.sh .` for a fast architectural baseline.
2. Run `python3 .vibe/skills/primary-school-advanced-delivery/scripts/federation_audit.py --root .` to validate federation wiring.
3. Run `python3 .vibe/skills/primary-school-advanced-delivery/scripts/route_inventory.py --root .` to map routes/navigation.
4. Run `python3 .vibe/skills/primary-school-advanced-delivery/scripts/impact_matrix.py --git-range HEAD~1..HEAD` to estimate change blast radius.
5. Run `python3 .vibe/skills/primary-school-advanced-delivery/scripts/release_preflight.py --root .` for baseline release checks.
6. Read `references/module-map.md` for module boundaries and handoff points.
7. Follow `references/workflow.md` and execute only the sections needed.

## Operating Protocol

### 1) Scope and Risk Classification

- Identify task class: `investigate`, `change`, or `release-check`.
- Identify impacted modules and shared contracts.
- Record constraints from user prompt before making changes.

### 2) Investigation Pass

- Prefer dedicated tools first: `read_file`, `grep`, MCP `git` and `filesystem`.
- Delegate broad exploration via `task` (agent: `explore`) when scope is unknown, multiple modules need mapping, or there are competing root-cause hypotheses.

Example `task` payload:

```json
{
  "agent": "explore",
  "task": "Trace login/session behavior across container and all remotes. Return ranked root-cause hypotheses with file:line evidence and impacted routes."
}
```

### 3) Plan Before Edit

- Produce file-level plan first.
- For each file: expected change, risk, and validation step.
- Keep edits minimal and avoid opportunistic refactors.

### 4) Implementation

- Apply one logical change unit at a time.
- Prefer `search_replace` for precise edits.
- Keep module contracts stable unless explicitly requested.

### 5) Verification Gates

- Run verification for each impacted module.
- If multiple modules are changed, run root-level build/status checks.
- If UI/flow is affected, use Playwright MCP smoke checks.

## Output Contract

Final response should include:

1. Changed files list.
2. Behavior change summary.
3. Verification commands executed and results.
4. Residual risks and follow-up checks (if any).

## References

- `references/workflow.md`: full decision tree and execution checklist.
- `references/module-map.md`: module ports, ownership, and integration boundaries.
- `scripts/context_scan.sh`: one-command baseline scan.
- `scripts/federation_audit.py`: federation config parser and warning linter.
- `scripts/route_inventory.py`: route and navigation inventory across modules.
- `scripts/impact_matrix.py`: change impact summary from paths or git range.
- `scripts/release_preflight.py`: release baseline checks.
