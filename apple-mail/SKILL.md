---
name: apple-mail
description: Work with Apple Mail on macOS using `fruitmail` for fast search/read and local helper scripts for draft/send and message actions. Use when the user wants to search inboxes, read messages, open messages, draft emails, or send Mail.app emails from a Mac.
homepage: https://github.com/gumadeiras/fruitmail-cli
---

# Apple Mail

Use Apple Mail through local tools already available on macOS.

Tool split:

- `fruitmail` for fast read-only search, metadata lookup, body fetch, and opening messages
- `scripts/mail_draft.sh` for creating drafts and sending new messages through Mail.app
- `scripts/mail_action.sh` for exact-message Mail.app actions by local message id
- `osascript` only for workflows not yet covered by the helper scripts

Check tools first:

```bash
fruitmail --help
osascript -e 'tell application "Mail" to get version'
{baseDir}/scripts/mail_action.sh --help
```

If `fruitmail` reports permission errors for `~/Library/Mail`, grant Full Disk Access to the terminal app in System Settings > Privacy & Security > Full Disk Access. Mail helper scripts may also trigger an Automation prompt for Mail.app.

Search and read:

```bash
fruitmail search --subject "invoice" --days 30 --unread --json
fruitmail sender "@amazon.com" --json
fruitmail to "alice@example.com" --json
fruitmail unread --json
fruitmail recent 7 --json
fruitmail body 94695 --json
fruitmail open 94695
fruitmail stats
```

Draft and send:

```bash
{baseDir}/scripts/mail_draft.sh --to alice@example.com --subject "Hello" --body "Hi Alice"
{baseDir}/scripts/mail_draft.sh --to alice@example.com,bob@example.com --subject "Status" --body "Latest update" --send
```

Act on an exact message:

```bash
fruitmail recent 7 --json
{baseDir}/scripts/mail_action.sh --id 49559 --action flag
{baseDir}/scripts/mail_action.sh --id 49559 --action unread
{baseDir}/scripts/mail_action.sh --id 49559 --action archive
{baseDir}/scripts/mail_action.sh --id 49559 --action junk
{baseDir}/scripts/mail_action.sh --id 49559 --action trash
{baseDir}/scripts/mail_action.sh --id 49559 --action move --target-mailbox "INBOX"
```

Safety rules:

- Draft first by default. Only send after the user explicitly asks to send.
- Reconfirm if recipients changed, if there are multiple recipients, or if reply-all/forward behavior is ambiguous.
- Treat delete, archive, and bulk mailbox changes as high-risk and require confirmation.
- Use exact message ids from `fruitmail` when taking actions. Do not rely on fuzzy sender/subject matching if a helper script can target the message directly.
- Do not invent custom folders or treat Favorite views as mailboxes. Use Apple Mail system actions such as flagging, mark unread, archive, junk, trash, or normal drafts.
- Do not claim to have used `Remind Me`, `Follow Up`, `Send Later`, or VIP automation unless you explicitly verified that workflow on the current machine for the current thread.
- Keep email content local-first. Do not introduce provider APIs or OAuth when Mail.app already has the accounts configured.

When to use `fruitmail`:

- search by sender, subject, recipient, unread, or recent date
- inspect local Apple Mail metadata quickly
- open a message in Mail.app
- read a single message body

When to use `mail_draft.sh`:

- create a Mail.app draft
- send a simple composed email through Mail.app

When to use `mail_action.sh`:

- flag or unflag a specific message
- mark a specific message read or unread
- archive, junk, trash, or move a specific message
- inspect the current mailbox/id state for a specific message before or after an action

Operational notes:

- `fruitmail` ids line up with Mail.app message ids for the current mailbox snapshot.
- A move creates a new local message id in the destination mailbox; re-query or use the helper's returned `new_id` before taking another action.
- Mailbox names are account mailboxes such as `INBOX`, `Archive`, `Junk`, `Deleted Messages`, `Drafts`, and `Sent Messages`.
- `scripts/mail_action.sh` currently reads the Apple Mail SQLite index from `~/Library/Mail/V10/MailData/Envelope Index`. Users on a different Mail schema version may need to update the path or query logic.

Limitations:

- `fruitmail` is read-only; it does not send mail.
- `mail_draft.sh` is for straightforward compose/send flows, not threaded reply composition.
- `mail_action.sh` covers per-message status and move actions, but not unsubscribe flows or threaded reply drafting.
- `mail_action.sh` assumes Apple Mail stores data in the V10 Envelope Index schema and that message ids from `fruitmail` line up with Mail.app row ids for the active snapshot.
- For advanced reply/forward/remind workflows, use `osascript` directly only after confirming the exact Mail.app behavior you need.
