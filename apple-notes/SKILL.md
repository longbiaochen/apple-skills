---
name: apple-notes
description: Manage Apple Notes via the `memo` CLI on macOS. Use when the user wants to create, list, search, edit, move, delete, or export Apple Notes on a Mac.
homepage: https://github.com/antoniorodr/memo
---

# Apple Notes

Use `memo notes` to manage Apple Notes directly from the terminal.

Setup:

- Check the CLI: `memo --help`
- If Notes access is blocked, ask the user to grant Automation access to the terminal app in System Settings.

Guidance:

- Use search before edit or delete when the target note is ambiguous.
- `memo` relies on interactive flows for some actions; if a non-interactive path is needed, explain the limitation and use the closest safe command.
- Notes with images or attachments may not support full edit flows.

When not to use:

- If the user wants reminders or alerts, use `apple-reminders`.
- If the user wants email drafting or inbox work, use `apple-mail`.

Read [references/usage.md](./references/usage.md) for command examples and workflow notes.
