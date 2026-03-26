# Codex Apple Skills

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![macOS](https://img.shields.io/badge/platform-macOS-black.svg)](https://www.apple.com/macos/)
[![Codex Skills](https://img.shields.io/badge/Codex-skills-blue.svg)](https://github.com/openai)

Local-first Codex skills for Apple Notes, Reminders, and Mail on macOS.

This repository packages four focused Codex skills:

- `apple-ecosystem`: a router skill that sends Apple app tasks to the right specialist skill
- `apple-notes`: manage Apple Notes through `memo`
- `apple-reminders`: manage Apple Reminders through `remindctl`
- `apple-mail`: search, read, draft, and act on Apple Mail with `fruitmail`, `osascript`, and helper scripts

The repo is intentionally small. It is a practical bundle you can copy into a Codex setup and use immediately.

## Why this exists

Most AI workflows reach for browser automation or third-party APIs. These skills take the opposite approach:

- stay local-first
- reuse Apple apps already configured on the Mac
- avoid new OAuth flows when local tools are enough
- keep workflows transparent and scriptable

## Architecture

The package has one router skill and three app-specific skills.

- `apple-ecosystem` decides whether a request belongs to Notes, Reminders, or Mail
- `apple-notes` wraps `memo`
- `apple-reminders` wraps `remindctl`
- `apple-mail` combines `fruitmail` for fast read-only access with helper scripts for drafting and exact-message actions

## Included Files

```text
apple-ecosystem/
  SKILL.md
apple-mail/
  SKILL.md
  scripts/
    mail_action.sh
    mail_draft.sh
apple-notes/
  SKILL.md
apple-reminders/
  SKILL.md
```

## Prerequisites

- macOS with Apple Notes, Reminders, and Mail available
- Codex installed and configured locally
- `osascript` and `sqlite3` available on the system
- these app-specific CLIs installed if you want full functionality:
  - [`memo`](https://github.com/antoniorodr/memo) for Apple Notes
  - [`remindctl`](https://github.com/steipete/remindctl) for Apple Reminders
  - [`fruitmail`](https://github.com/gumadeiras/fruitmail-cli) for Apple Mail search and read

## Install

Copy or symlink the skill folders into your Codex skills directory.

```bash
cd /path/to/your/apple-skills
cp -R apple-ecosystem apple-mail apple-notes apple-reminders ~/.codex/skills/
```

Or symlink them during development:

```bash
cd /path/to/your/apple-skills
ln -s "$(pwd)/apple-ecosystem" ~/.codex/skills/apple-ecosystem
ln -s "$(pwd)/apple-mail" ~/.codex/skills/apple-mail
ln -s "$(pwd)/apple-notes" ~/.codex/skills/apple-notes
ln -s "$(pwd)/apple-reminders" ~/.codex/skills/apple-reminders
```

## Verify Setup

Run the underlying tools directly before using the skills:

```bash
memo --help
remindctl --help
remindctl status
fruitmail --help
osascript -e 'tell application "Mail" to get version'
./apple-mail/scripts/mail_draft.sh --help
./apple-mail/scripts/mail_action.sh --help
```

## macOS Permissions

You may need to approve the terminal app or Codex host app in System Settings:

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

Typical end-to-end use inside Codex:

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

Codex skills, macOS automation, Apple Mail CLI, Apple Notes CLI, Apple Reminders CLI, local-first AI, Mail.app automation, Apple productivity workflows.
