---
name: apple-mail
description: Work with Apple Mail on macOS using `fruitmail` for fast search/read and local helper scripts for draft/send and message actions. Use when the user wants to search inboxes, read messages, open messages, draft emails, or send Mail.app emails from a Mac.
homepage: https://github.com/gumadeiras/fruitmail-cli
---

# Apple Mail

Use Apple Mail through local tools already available on macOS.

If the `apple-plugin` Codex plugin is installed, prefer its `apple_mail_*` MCP tools first. Fall back to the direct commands in this skill when the plugin is unavailable.

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

Safety rules:

- Draft first by default. Only send after the user explicitly asks to send.
- Reconfirm if recipients changed, if there are multiple recipients, or if reply-all/forward behavior is ambiguous.
- Treat delete, archive, and bulk mailbox changes as high-risk and require confirmation.
- Use exact message ids from `fruitmail` when taking actions. Do not rely on fuzzy sender/subject matching if a helper script can target the message directly.
- Do not invent custom folders or treat Favorite views as mailboxes. Use Apple Mail system actions such as flagging, mark unread, archive, junk, trash, or normal drafts.
- Do not claim to have used `Remind Me`, `Follow Up`, `Send Later`, or VIP automation unless you explicitly verified that workflow on the current machine for the current thread.
- Keep email content local-first. Do not introduce provider APIs or OAuth when Mail.app already has the accounts configured.

When to use each tool:

- Use `fruitmail` for search, metadata lookup, reading bodies, and opening messages.
- Use `scripts/mail_draft.sh` to create drafts and send only when explicitly requested.
- Use `scripts/mail_action.sh` for exact-message actions by id.
- Use `osascript` only when the helper scripts do not cover the requested Mail.app workflow.

Read [references/usage.md](./references/usage.md) for examples, permissions, compatibility notes, and operational limitations.
