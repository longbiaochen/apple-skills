# Apple Plugin Workflows

## Install

Install the plugin into Codex by symlinking or copying `apple-plugin/` into `~/.codex/plugins/local/apple-plugin`.

Quick install:

```bash
cd /path/to/apple-skills/apple-plugin
./scripts/install-local-plugin.sh
```

## Tool Routing

- `apple_doctor`: dependency and permission checks
- `apple_notes_*`: list, search, create, update, and delete notes
- `apple_reminders_*`: show, list lists, add, edit, complete, and delete reminders
- `apple_mail_*`: search/read/open mail, create draft, send draft-like compose flows, and exact message actions

## Fallback Model

If the plugin is not installed:

- use `apple-ecosystem/SKILL.md` as the router
- use the app-specific canonical skills directly
- keep the same local-first safety defaults

## Safety Model

- Mail drafts come before send unless the user explicitly requests send.
- Mail deletes, archives, and mailbox moves require explicit user intent.
- Reminder and note deletes require explicit confirmation.
- The plugin does not introduce provider APIs or new OAuth flows when local Apple tooling is enough.
