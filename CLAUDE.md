# Apple Skills For Claude

This repo provides a local-first macOS Apple app toolkit for Claude-style agent workflows.

For Codex specifically, the preferred install surface is the local `apple-plugin/` package. The root skill folders below remain canonical.

The source of truth is the four canonical skills:

- `apple-ecosystem`
- `apple-mail`
- `apple-notes`
- `apple-reminders`

Read [docs/agent-contract.md](./docs/agent-contract.md) first, then consult the relevant `SKILL.md` file for the task at hand.

## Routing

- Notes and Apple Notes work -> `apple-notes`
- Reminders work -> `apple-reminders`
- Mail.app search, read, triage, draft, and send work -> `apple-mail`
- Mixed or ambiguous Apple app requests -> `apple-ecosystem`

## Shared Defaults

- Use local macOS tools already configured on the machine.
- Use `memo` for Notes, `remindctl` for Reminders, and `fruitmail` plus the Mail helper scripts for Mail.
- Draft before send unless the user explicitly asks to send.
- Confirm destructive or ambiguous actions before executing them.
- Do not replace these local workflows with provider APIs or browser automation unless the local path cannot do the job.

## Consumption Model

- Claude should treat each `SKILL.md` as the canonical task guide for that capability.
- Use this file only as the repo-level adapter that points Claude to the correct canonical skill.
