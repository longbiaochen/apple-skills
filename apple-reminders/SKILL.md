---
name: apple-reminders
description: Manage Apple Reminders via the `remindctl` CLI on macOS. Use when the user wants to list, add, edit, complete, or delete reminders or reminder lists on a Mac.
homepage: https://github.com/steipete/remindctl
---

# Apple Reminders

Use `remindctl` to manage Apple Reminders directly from the terminal.

Setup:

- Check the CLI: `remindctl --help`
- Check authorization: `remindctl status`
- If needed, request access: `remindctl authorize`

Common commands:

```bash
remindctl show
remindctl today
remindctl tomorrow
remindctl week
remindctl overdue
remindctl all
remindctl list
remindctl list Work
remindctl add "Buy milk"
remindctl add --title "Call mom" --list Personal --due tomorrow
remindctl complete 1 2 3
remindctl delete 4A83 --force
```

Guidance:

- If the user says "remind me", clarify whether they want an Apple Reminders item or an agent-level alert/automation.
- Prefer JSON output when you need structured parsing.
- Confirm destructive deletes before executing them.

Date inputs accepted by `remindctl` include:

- `today`, `tomorrow`, `yesterday`
- `YYYY-MM-DD`
- `YYYY-MM-DD HH:mm`
- ISO 8601
