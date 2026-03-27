---
name: apple-reminders
description: Manage Apple Reminders via the `remindctl` CLI on macOS. Use when the user wants to list, add, edit, complete, or delete reminders or reminder lists on a Mac.
homepage: https://github.com/steipete/remindctl
---

# Apple Reminders

Use `remindctl` to manage Apple Reminders directly from the terminal.

If the `apple-plugin` Codex plugin is installed, prefer its `apple_reminders_*` MCP tools first. Fall back to `remindctl` when the plugin is unavailable.

Setup:

- Check the CLI: `remindctl --help`
- Check authorization: `remindctl status`
- If needed, request access: `remindctl authorize`

Guidance:

- If the user says "remind me", clarify whether they want an Apple Reminders item or an agent-level alert/automation.
- Prefer JSON output when you need structured parsing.
- Confirm destructive deletes before executing them.

Read [references/usage.md](./references/usage.md) for command examples and accepted date formats.
