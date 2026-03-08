# Advanced Workflow

## Decision Matrix

| Task Type | Trigger | Primary Goal | Typical Tools |
|---|---|---|---|
| Investigate | Unknown root cause, regressions, unclear ownership | Identify root cause with evidence | `read_file`, `grep`, `task`, `git_*`, `filesystem_*` |
| Change | Clear feature/fix request | Implement smallest safe delta | `search_replace`, `write_file`, `read_file`, module builds |
| Release-check | Pre-release confidence | Validate module integration and runtime status | `bash`, `git_*`, Playwright MCP, `check-status` |

## Execution Checklist

1. Confirm impacted modules and risks.
2. Run baseline scan:
   - `bash .vibe/skills/primary-school-advanced-delivery/scripts/context_scan.sh .`
   - `python3 .vibe/skills/primary-school-advanced-delivery/scripts/federation_audit.py --root .`
   - `python3 .vibe/skills/primary-school-advanced-delivery/scripts/route_inventory.py --root .`
3. For broad unknowns, delegate exploration:
   - `task` with explicit expected output format.
4. Produce file-level implementation plan.
5. Implement minimal change units.
6. Verify each unit before moving forward.
7. Run affected-module build checks.
8. Run cross-module sanity checks from container view.
9. Summarize evidence and residual risks.

## Verification Matrix

| If You Change | Required Verification |
|---|---|
| `container/src/*` | `cd container && npm run build` + navigation smoke |
| `maths-science/src/*` | `cd maths-science && npm run build` + remote load check |
| `exam/src/*` | `cd exam && npm run build` + remote load check |
| `student-records/src/*` | `cd student-records && npm run build` + remote load check |
| multiple modules | `npm run check-status` and `npm run build:all` (when feasible) |
| webpack federation config | verify `remoteEntry.js` URLs and module name/expose consistency |

## Task Delegation Patterns

### Root Cause Sweep

```json
{
  "agent": "explore",
  "task": "Investigate [ISSUE] across all microfrontends. Return top 5 hypotheses ranked by confidence with file:line evidence and impacted user paths."
}
```

### Refactor Risk Scan

```json
{
  "agent": "explore",
  "task": "Map all call-sites and contracts affected by changing [COMPONENT/API]. Return break-risk matrix and a safe migration order."
}
```

### Release Readiness Scan

```json
{
  "agent": "explore",
  "task": "Audit release readiness for this branch. Return integration risks, missing checks, and exact commands to validate before merge."
}
```
