# How To Write Skills For Vibe

## What A Skill Is

A Vibe skill is a folder containing a required `SKILL.md` file with YAML frontmatter + instructions.
Vibe discovers skills, exposes them in prompt context, and lets you invoke user-invocable skills with `/skill-name`.

## Where To Put Skills

In this repo, use:

- `.vibe/skills/<skill-name>/SKILL.md`

Your config already includes:

- `skill_paths = [".vibe/skills"]` in `.vibe/config.toml`
- `skill_paths = [".vibe/skills"]` in `.vibe/config_win.toml`

## Required Structure

```text
.vibe/skills/
└── my-skill/
    ├── SKILL.md
    ├── scripts/       # optional: executable helpers
    ├── references/    # optional: detailed docs loaded as needed
    └── assets/        # optional: templates/files for output
```

## Minimal `SKILL.md` Template

```md
---
name: my-skill
description: Use when [specific trigger conditions]. Provides [outcome].
user-invocable: true
compatibility: mistral-vibe CLI in this repository
---

# My Skill

## Use This Skill When
- [Concrete trigger 1]
- [Concrete trigger 2]

## Workflow
1. [Step 1]
2. [Step 2]
3. [Verification step]

## References
- `references/...`
- `scripts/...`
```

## Frontmatter Rules

| Field | Rule |
|---|---|
| `name` | lowercase + digits + hyphens only, max length 64, should match folder name |
| `description` | most important field for auto-triggering; explicitly state when to use the skill |
| `user-invocable` | set `true` if you want slash invocation (`/skill-name`) |
| `allowed-tools` | supported in metadata, currently experimental in enforcement |

## Advanced Authoring Pattern (Recommended)

Use progressive disclosure:

1. Keep `SKILL.md` concise (decision rules + workflow only).
2. Put heavy details in `references/*.md`.
3. Put deterministic or repetitive work in `scripts/*`.
4. Keep templates/boilerplate in `assets/*`.

This reduces prompt bloat and improves reliability.

## Triggering Strategy (High Impact)

Write `description` so Vibe can match tasks automatically:

- Bad: `Handles frontend work`
- Good: `Use for cross-module microfrontend changes, federation config updates, and release hardening in primary-school repo.`

In chat, you can force it explicitly:

- `/my-skill`

## Validation And Reload

After creating or editing a skill:

1. Ensure frontmatter is valid YAML.
2. Ensure `name` matches folder naming convention.
3. Ensure instructions are executable and not vague.
4. Run `/reload` in Vibe to refresh config + skill discovery.
5. Invoke `/my-skill` and run one small task to confirm behavior.

## Common Mistakes

- Overly generic `description` (weak auto-trigger).
- Huge `SKILL.md` with no `references/` split.
- Missing verification steps in workflow.
- Naming mismatch between folder and `name`.
- Relying on skill as a tool; skills are instruction files, not tools.

## Suggested Workflow For New Skills

1. Define 3-5 real user prompts that should trigger the skill.
2. Draft frontmatter + concise workflow in `SKILL.md`.
3. Add `references/` and `scripts/` only where needed.
4. Add one copy-paste invocation example.
5. Reload Vibe and run a smoke test.
