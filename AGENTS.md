# Apple Skills For AGENTS-Style Runtimes

This repo is a universal, local-first Apple app skill pack for macOS agents.

For Codex specifically, the preferred install surface is the local `apple-plugin/` package. The root skill folders below remain canonical.

The canonical behavior lives in the skill folders:

- `apple-ecosystem`
- `apple-mail`
- `apple-notes`
- `apple-reminders`

Read [docs/agent-contract.md](./docs/agent-contract.md) for the shared invariants. Do not invent behavior that conflicts with those canonical skills.

## Routing

- Notes or Apple Notes requests -> `apple-notes`
- Reminders requests -> `apple-reminders`
- Mail.app, inbox triage, draft/send/search email -> `apple-mail`
- Mixed Apple app requests -> start with `apple-ecosystem`

## Tool Mapping

- Apple Notes -> `memo`
- Apple Reminders -> `remindctl`
- Apple Mail search/read -> `fruitmail`
- Apple Mail draft/send/message actions -> `apple-mail/scripts/mail_draft.sh`, `apple-mail/scripts/mail_action.sh`, and `osascript` when needed

## Canonical Command Examples

- Notes: `memo notes`, `memo notes -s "query"`, `memo notes -a "Note Title"`
- Reminders: `remindctl today`, `remindctl add --title "Call mom" --list Personal --due tomorrow`, `remindctl complete 1 2 3`
- Mail search/read: `fruitmail unread --json`, `fruitmail recent 7 --json`, `fruitmail body 94695 --json`, `fruitmail open 94695`
- Mail draft/send/actions: `apple-mail/scripts/mail_draft.sh --to alice@example.com --subject "Hello" --body "Hi Alice"`, `apple-mail/scripts/mail_action.sh --id 49559 --action archive`

## Safety Defaults

- Keep workflows local-first on macOS.
- Prefer native Apple app CLIs over browser automation.
- Draft email before send by default.
- Confirm destructive or ambiguous writes before executing them.
- Do not introduce third-party APIs or OAuth when the local Apple app setup already provides the needed capability.

## How To Consume This Repo

- For Codex, prefer `apple-plugin/` when you want one plugin install with an MCP server.
- If your runtime supports folder-level skills, use the four skill folders directly.
- If your runtime supports only repo-level agent instructions, use this file as the adapter and read the matching `SKILL.md` file before acting.
- Treat the skill folders as canonical and this file as a routing shim.
