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
- `ms365-sharepoint`
- `ssh-remote` (configured for Unix + Windows)
- `react-magic` (React component generation)
- `asciidoc-dacli` (AsciiDoc docs workflows)
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

## Playwright Existing Chrome Mode

`playwright` is configured in extension mode:
- `@playwright/mcp --extension`

Behavior:
- Reuses already open Chrome windows/tabs through the Playwright MCP Bridge extension.
- Opens/uses tabs in that existing browser session instead of launching a separate browser process.

Requirements:
- Install Playwright MCP Bridge Chrome extension.
- Keep Chrome running with the extension enabled before starting Vibe actions.

## SSH MCP (Unix + Windows)

`ssh-remote` is configured with `@aiondadotcom/mcp-ssh` in:
- `.vibe/config.toml`
- `.vibe/config_win.toml`

Prerequisites:
- `ssh` available on PATH.
- Target hosts reachable from your machine.
- SSH auth working first from terminal (key or agent).

Recommended validation:
1. Restart Vibe CLI.
2. Ask Vibe to list known hosts from your SSH config.
3. Ask Vibe to run a simple remote command like `hostname` on one host.

## React MCP

`react-magic` is configured with `@21st-dev/magic@latest` in:
- `.vibe/config.toml`
- `.vibe/config_win.toml`

Setup:
- Replace `API_KEY` placeholder in both config files with your 21st.dev key.
- Restart Vibe CLI.

Usage examples:
1. Ask Vibe to generate a React component from a UI intent.
2. Ask Vibe to refine an existing component for responsiveness and accessibility.

## AsciiDoc MCP

`asciidoc-dacli` is configured with `dacli-mcp` in:
- `.vibe/config.toml`
- `.vibe/config_win.toml`

Notes:
- Current `--docs-root` points at this repository root.
- If your AsciiDoc lives in a subfolder, change `--docs-root` to that path.

Recommended validation:
1. Restart Vibe CLI.
2. Ask Vibe to list available AsciiDoc MCP tools.
3. Run a simple AsciiDoc operation against a file in your docs root.

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



## Sharepoint MCP 

With your current ms365-sharepoint setup (@softeria/ms-365-mcp-server --org-mode), Vibe can call these SharePoint MCP tool commands:

search-sharepoint-sites
get-sharepoint-site
get-sharepoint-site-by-path
list-sharepoint-site-drives
get-sharepoint-site-drive-by-id
list-sharepoint-site-items
get-sharepoint-site-item
list-sharepoint-site-lists
get-sharepoint-site-list
list-sharepoint-site-list-items
get-sharepoint-site-list-item
get-sharepoint-sites-delta
Because you enabled --org-mode, it also exposes org tools like:

Teams/Chat tools (list-chats, list-team-channels, send-channel-message, etc.)
Shared mailbox tools (list-shared-mailbox-messages, send-shared-mailbox-mail)
User lookup (list-users)
Plus personal M365 tools (mail, calendar, OneDrive, Excel, OneNote, To Do, contacts, search)

For @aiondadotcom/mcp-ssh, the core MCP tool commands are:

listKnownHosts()
getHostInfo(hostAlias)
checkConnectivity(hostAlias)
runRemoteCommand(hostAlias, command)
runCommandBatch(hostAlias, commands)
uploadFile(hostAlias, localPath, remotePath)
downloadFile(hostAlias, remotePath, localPath)
Server startup command (if run manually):

Unix/macOS: npx -y @aiondadotcom/mcp-ssh
Windows: cmd /c npx -y @aiondadotcom/mcp-ssh
Quick Vibe prompt examples:

“List all SSH hosts.”
“Check connectivity to prod-web.”
“Run hostname && uptime on prod-web.”
“Upload ./build/app.tar.gz to /tmp/app.tar.gz on prod-web.”
