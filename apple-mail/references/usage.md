# Apple Mail Reference

## Search and Read

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

## Draft and Send

```bash
{baseDir}/scripts/mail_draft.sh --to alice@example.com --subject "Hello" --body "Hi Alice"
{baseDir}/scripts/mail_draft.sh --to alice@example.com,bob@example.com --subject "Status" --body "Latest update" --send
```

## Exact Message Actions

```bash
fruitmail recent 7 --json
{baseDir}/scripts/mail_action.sh --id 49559 --action flag
{baseDir}/scripts/mail_action.sh --id 49559 --action unread
{baseDir}/scripts/mail_action.sh --id 49559 --action archive
{baseDir}/scripts/mail_action.sh --id 49559 --action junk
{baseDir}/scripts/mail_action.sh --id 49559 --action trash
{baseDir}/scripts/mail_action.sh --id 49559 --action move --target-mailbox "INBOX"
```

## Permissions

- If `fruitmail` reports permission errors for `~/Library/Mail`, grant Full Disk Access to the terminal app in System Settings > Privacy & Security > Full Disk Access.
- Mail helper scripts may trigger an Automation prompt for Mail.app.

## Operational Notes

- `fruitmail` ids line up with Mail.app message ids for the current mailbox snapshot.
- A move creates a new local message id in the destination mailbox; re-query or use the helper's returned `new_id` before taking another action.
- Mailbox names are account mailboxes such as `INBOX`, `Archive`, `Junk`, `Deleted Messages`, `Drafts`, and `Sent Messages`.
- `scripts/mail_action.sh` currently reads the Apple Mail SQLite index from `~/Library/Mail/V10/MailData/Envelope Index`. Users on a different Mail schema version may need to update the path or query logic.

## Limitations

- `fruitmail` is read-only; it does not send mail.
- `mail_draft.sh` is for straightforward compose and send flows, not threaded reply composition.
- `mail_action.sh` covers per-message status and move actions, but not unsubscribe flows or threaded reply drafting.
- For advanced reply, forward, or remind workflows, use `osascript` only after confirming the exact Mail.app behavior required on the current machine.
