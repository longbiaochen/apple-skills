# Apple Skills

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![macOS](https://img.shields.io/badge/platform-macOS-black.svg)](https://www.apple.com/macos/)
[![Local First](https://img.shields.io/badge/workflow-local--first-blue.svg)](./docs/agent-contract.md)

Local-first Apple app tooling for coding agents on macOS, packaged as a Codex plugin and preserved as canonical skills.

Repo: [github.com/longbiaochen/apple-skills](https://github.com/longbiaochen/apple-skills)

This repository now ships two coordinated surfaces:

- `apple-plugin/`: the preferred Codex-local plugin with one MCP install surface
- the canonical root skill folders, which remain the source of truth for behavior and fallback use

The canonical root skills are:

- `apple-ecosystem`: a router skill that sends Apple app tasks to the right specialist skill
- `apple-notes`: manage Apple Notes through `memo`
- `apple-reminders`: manage Apple Reminders through `remindctl`
- `apple-mail`: search, read, draft, and act on Apple Mail with `fruitmail`, `osascript`, and helper scripts

The root skill folders are the source of truth. The Codex plugin packages those workflows into a single installable unit. Repo-level files such as `README.md`, `AGENTS.md`, and `CLAUDE.md` are adapters that mirror the canonical skills instead of redefining them.

## Why this exists

Most AI workflows reach for browser automation or third-party APIs. This repo takes the opposite approach:

- stay local-first
- reuse Apple apps already configured on the Mac
- avoid new OAuth flows when local tools are enough
- keep workflows transparent and scriptable

## Canonical Surface

The package has one plugin-first Codex surface and four canonical root skills:

- `apple-plugin`: local Codex plugin with an MCP server for doctor, notes, reminders, and mail
- `apple-ecosystem`: root router skill
- `apple-notes`: root Notes skill
- `apple-reminders`: root Reminders skill
- `apple-mail`: root Mail skill

The root skills define the canonical behavior. The plugin reuses that behavior but exposes it as a single Codex-local plugin plus MCP server.

Shared behavior invariants live in [docs/agent-contract.md](./docs/agent-contract.md).

## Included Files

```text
AGENTS.md
CLAUDE.md
.agents/
  plugins/
    marketplace.json
apple-plugin/
  .codex-plugin/
    plugin.json
  .mcp.json
  package.json
  references/
    workflows.md
  scripts/
    install-local-plugin.sh
    print-codex-config.mjs
    run-doctor.mjs
  skills/
    apple-plugin/
      SKILL.md
      agents/openai.yaml
  src/
    server.mjs
apple-ecosystem/
  SKILL.md
  agents/openai.yaml
apple-mail/
  SKILL.md
  agents/openai.yaml
  references/
    usage.md
  scripts/
    mail_action.sh
    mail_draft.sh
apple-notes/
  SKILL.md
  agents/openai.yaml
  references/
    usage.md
apple-reminders/
  SKILL.md
  agents/openai.yaml
  references/
    usage.md
docs/
  agent-contract.md
```

## Prerequisites

- macOS with Apple Notes, Reminders, and Mail available
- `osascript` and `sqlite3` available on the system
- these app-specific CLIs installed if you want full functionality:
  - [`memo`](https://github.com/antoniorodr/memo) for Apple Notes
  - [`remindctl`](https://github.com/steipete/remindctl) for Apple Reminders
  - [`fruitmail`](https://github.com/gumadeiras/fruitmail-cli) for Apple Mail search and read

## Compatibility

| Runtime | Entry point | Notes |
| --- | --- | --- |
| Codex plugin | `apple-plugin/` | Preferred one-install Codex surface with MCP tools. |
| Codex / OpenAI skills | root skill folders + `SKILL.md` | Direct skill fallback when you do not want the plugin. |
| Claude | `CLAUDE.md` | Use the repo-level adapter, then follow the relevant skill. |
| AGENTS-style runtimes, including OpenClaw | `AGENTS.md` | Use the repo-level adapter, then follow the relevant skill. |

## Repo Links

- GitHub repo: [github.com/longbiaochen/apple-skills](https://github.com/longbiaochen/apple-skills)
- Canonical contract: [docs/agent-contract.md](./docs/agent-contract.md)
- AGENTS adapter: [AGENTS.md](./AGENTS.md)
- Claude adapter: [CLAUDE.md](./CLAUDE.md)
- Launch drafts: [docs/launch/x.md](./docs/launch/x.md), [docs/launch/github-discussion.md](./docs/launch/github-discussion.md), [docs/launch/hacker-news.md](./docs/launch/hacker-news.md), [docs/launch/reddit.md](./docs/launch/reddit.md)

## Install And Consume

### Codex Plugin

Install the plugin into your local Codex plugins directory:

```bash
cd /path/to/your/apple-skills/apple-plugin
npm install
./scripts/install-local-plugin.sh
```

This gives Codex one plugin entry point that bundles:

- the `apple-plugin` skill
- the `apple-plugin` MCP server
- Notes, Reminders, Mail, and doctor tools in one local package

If you want a direct `config.toml` snippet instead of plugin discovery, print one with:

```bash
node ./apple-plugin/scripts/print-codex-config.mjs
```

### Canonical Skill Fallback

Copy or symlink the root skill folders into your Codex skills directory when you want direct skill installs without the plugin:

```bash
cd /path/to/your/apple-skills
cp -R apple-ecosystem apple-mail apple-notes apple-reminders ~/.codex/skills/
```

Each root skill includes `agents/openai.yaml` metadata for OpenAI-style skill UIs.

### Claude

Read [`CLAUDE.md`](./CLAUDE.md) as the repo-level adapter, then consult the relevant skill folder.

### AGENTS-Style Runtimes / OpenClaw

Read [`AGENTS.md`](./AGENTS.md) as the repo-level adapter, then consult the relevant skill folder.

## Verify Setup

Run the underlying tools directly before using the skills or plugin:

```bash
npm --prefix apple-plugin install
npm --prefix apple-plugin run doctor
memo --help
remindctl --help
remindctl status
fruitmail --help
osascript -e 'tell application "Mail" to get version'
./apple-mail/scripts/mail_draft.sh --help
./apple-mail/scripts/mail_action.sh --help
```

## macOS Permissions

You may need to approve the terminal app or agent host app in System Settings:

- Apple Notes: Automation access if `memo` or AppleScript triggers Notes access prompts
- Apple Reminders: run `remindctl authorize` if `remindctl status` shows access is missing
- Apple Mail:
  - Full Disk Access for `fruitmail` or direct Mail database access
  - Automation permission for Mail.app when running the helper scripts

If Mail access fails, check `System Settings > Privacy & Security`.

## Usage Recipes

### Notes

```bash
memo notes
memo notes -s "trip"
memo notes -a "Weekly Plan"
memo notes -e
```

### Reminders

```bash
remindctl today
remindctl add --title "Call mom" --list Personal --due tomorrow
remindctl complete 1 2 3
```

### Mail Search And Read

```bash
fruitmail unread --json
fruitmail search --subject "invoice" --days 30 --json
fruitmail body 94695 --json
fruitmail open 94695
```

### Mail Drafting

```bash
./apple-mail/scripts/mail_draft.sh \
  --to alice@example.com \
  --subject "Hello" \
  --body "Hi Alice"
```

### Mail Actions

```bash
./apple-mail/scripts/mail_action.sh --id 49559 --action flag
./apple-mail/scripts/mail_action.sh --id 49559 --action archive
./apple-mail/scripts/mail_action.sh --id 49559 --action move --target-mailbox "INBOX"
```

## Demo Flow

Typical end-to-end use for any agent:

1. User asks to search recent unread mail from a sender.
2. `apple-ecosystem` routes to `apple-mail`.
3. `apple-mail` uses `fruitmail` to find exact messages.
4. If needed, `apple-mail` drafts a reply or applies an exact action with the helper scripts.

The same pattern applies to Notes and Reminders: route first, then use the smallest local tool that can do the job safely.

## Non-Goals

- cross-platform support outside macOS
- cloud sync integrations beyond what Apple apps already provide
- provider-specific email APIs or browser automation as the default path
- advanced Apple Mail reply threading or unsubscribe automation

## Compatibility Notes

- `apple-mail/scripts/mail_action.sh` currently targets Apple Mail's `~/Library/Mail/V10/MailData/Envelope Index` SQLite path and schema.
- Apple Mail storage details can change across macOS releases. If your system uses a different versioned path or schema, adjust the script before relying on exact-message actions.
- `fruitmail` is read-only. Sending and message state changes are handled separately by AppleScript-based helpers.

## Launch Copy

Ready-to-post launch drafts live in [docs/launch/x.md](./docs/launch/x.md), [docs/launch/github-discussion.md](./docs/launch/github-discussion.md), [docs/launch/hacker-news.md](./docs/launch/hacker-news.md), and [docs/launch/reddit.md](./docs/launch/reddit.md).

## Keywords

AI agent skills, Codex skills, Claude agents, OpenClaw, AGENTS.md, macOS automation, Apple Mail CLI, Apple Notes CLI, Apple Reminders CLI, local-first AI, Mail.app automation, Apple productivity workflows.
