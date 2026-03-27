---
name: apple-plugin
description: Use the Apple plugin MCP server in Codex for local Apple Notes, Reminders, Mail, and environment doctor workflows on macOS. Prefer this when the plugin is installed and the user wants one plugin-backed Apple app workflow.
---

# Apple Plugin

Use this skill when the `apple-plugin` Codex plugin is installed. It is the preferred Codex entry point for this repository.

What it packages:

- an MCP server with Apple Notes, Reminders, Mail, and doctor tools
- the same local-first safety defaults as the canonical `apple-skills` skill folders
- the existing Apple CLIs and helper scripts already used by this repo

Use the MCP server first:

- `apple_doctor` to inspect local dependencies and permissions
- `apple_notes_*` for structured Apple Notes operations
- `apple_reminders_*` for Apple Reminders operations
- `apple_mail_*` for Apple Mail search, drafts, send, and exact-message actions

Rules:

- Keep workflows local-first on macOS.
- Draft email before send by default.
- Confirm destructive or ambiguous writes before executing them.
- If the plugin is unavailable, fall back to the canonical skill folders in the repo root.

Read [../../references/workflows.md](../../references/workflows.md) for install steps, tool routing, and the fallback model.
