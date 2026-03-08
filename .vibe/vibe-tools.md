# Vibe Tools Notes

## MCP Sampling

`MCP Sampling` means an MCP server can ask Vibe to run an LLM completion while that MCP tool call is in progress.

Flow:
1. Vibe invokes an MCP tool.
2. MCP server sends a sampling request (`sampling/createMessage`) to Vibe.
3. Vibe runs completion on the active model.
4. Result is returned to the MCP server.
5. MCP server uses that result and returns final tool output.

## Current Project Setting

Sampling is explicitly enabled for all configured MCP servers in:
- `.vibe/config.toml`
- `.vibe/config_win.toml`

Configured MCP servers:
- `playwright`
- `filesystem`
- `fetch`
- `git`
- `memory`
- `time`
- `sequential-thinking`
- `clickhouse`
- `windows-mcp` (Windows config only)

## What Changes In Practice

- MCP servers can perform multi-step reasoning with the host model.
- Complex MCP tools generally behave better.
- Tool calls may consume more model tokens.
- Tool latency may increase (extra completion round trips).
- MCP input context may be included in model sampling requests.

## Disable For One Server (If Needed)

```toml
[[mcp_servers]]
name = "sequential-thinking"
transport = "stdio"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-sequential-thinking"]
sampling_enabled = false
```

## Verify It Is Working

- Restart Vibe after config changes.
- Check debug logs during an MCP tool call.
- Look for sampling-related activity (for example `sampling/createMessage`).

## Task Tool Templates

Use these with the `task` tool (`agent` defaults to `explore`).

### 1) Codebase Audit

```json
{
  "agent": "explore",
  "task": "Audit the repository for authentication, authorization, and session handling. Return: (1) file paths with line references, (2) current flow diagram in text, (3) top 10 security/logic risks ranked high->low, (4) concrete remediation steps per risk."
}
```

### 2) Bug Hunt

```json
{
  "agent": "explore",
  "task": "Investigate why [BUG_DESCRIPTION] happens in [ENV]. Find likely root causes with evidence from code paths and logs/config. Return: hypotheses ranked by confidence, exact files/lines, and minimal reproduction steps."
}
```

### 3) Refactor Plan

```json
{
  "agent": "explore",
  "task": "Create a step-by-step refactor plan for [MODULE/FEATURE] to improve maintainability without behavior changes. Return: current architecture summary, pain points, phased plan, risk per phase, rollback strategy, and acceptance criteria."
}
```

### 4) Test Gap Analysis

```json
{
  "agent": "explore",
  "task": "Analyze test coverage quality for [MODULE]. Identify critical missing tests (unit/integration/e2e), fragile tests, and untested edge cases. Return: prioritized test backlog with rationale and suggested test case names."
}
```

### 5) Dependency Risk Review

```json
{
  "agent": "explore",
  "task": "Review dependencies and build/runtime tooling for risk and maintenance issues. Return: outdated/high-risk packages, why each is risky, migration options, expected impact, and a safe upgrade sequence."
}
```

## Advanced Skill Added

Skill name:
- `primary-school-advanced-delivery`

Path:
- `.vibe/skills/primary-school-advanced-delivery/SKILL.md`

How to invoke in Vibe:
- `/primary-school-advanced-delivery`

Recommended first command after invoking:

```bash
bash .vibe/skills/primary-school-advanced-delivery/scripts/context_scan.sh .
```
