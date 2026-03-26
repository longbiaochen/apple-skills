#!/usr/bin/env bash
set -euo pipefail

show_help() {
  cat <<'EOF'
Usage:
  mail_action.sh --id 49559 --action flag
  mail_action.sh --id 49559 --action archive
  mail_action.sh --id 49559 --action move --target-mailbox "INBOX"

Actions:
  flag         Set flagged status to true
  unflag       Set flagged status to false
  read         Mark message as read
  unread       Mark message as unread
  archive      Move message to Archive
  junk         Move message to Junk
  trash        Move message to Deleted Messages
  move         Move message to --target-mailbox
  info         Print message metadata from the local Mail index

Options:
  --id <rowid>              Envelope Index row ID / Mail message id
  --action <name>           Action to perform
  --target-mailbox <name>   Required only for --action move
  -h, --help                Show this help

Notes:
  - Move actions create a new local row ID in the destination mailbox.
  - The JSON output includes `new_id` after a move when it can be resolved.
  - This script currently expects Apple Mail's V10 `Envelope Index` SQLite database layout.
EOF
}

message_id=""
action=""
target_mailbox=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --id)
      message_id="${2:-}"
      shift 2
      ;;
    --action)
      action="${2:-}"
      shift 2
      ;;
    --target-mailbox)
      target_mailbox="${2:-}"
      shift 2
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      show_help >&2
      exit 1
      ;;
  esac
done

if [[ -z "$message_id" || -z "$action" ]]; then
  echo "--id and --action are required" >&2
  show_help >&2
  exit 1
fi

case "$action" in
  flag|unflag|read|unread|archive|junk|trash|move|info)
    ;;
  *)
    echo "Unsupported action: $action" >&2
    exit 1
    ;;
esac

if [[ "$action" == "move" && -z "$target_mailbox" ]]; then
  echo "--target-mailbox is required for action=move" >&2
  exit 1
fi

# Apple Mail database layouts can vary by macOS release. This repo currently targets
# the V10 Envelope Index path and schema that the original skill was built against.
DB_PATH="${HOME}/Library/Mail/V10/MailData/Envelope Index"
if [[ ! -f "$DB_PATH" ]]; then
  echo "Mail database not found at $DB_PATH" >&2
  exit 1
fi

MESSAGE_JSON="$(sqlite3 -json "$DB_PATH" "
SELECT
  m.ROWID AS rowid,
  m.message_id AS message_id,
  m.global_message_id AS global_message_id,
  COALESCE(m.document_id, '') AS document_id,
  COALESCE(a.address, '') AS sender,
  COALESCE(s.subject, '') AS subject,
  m.read AS is_read,
  m.flagged AS is_flagged,
  mb.url AS mailbox_url
FROM messages m
LEFT JOIN addresses a ON a.ROWID = m.sender
LEFT JOIN subjects s ON s.ROWID = m.subject
JOIN mailboxes mb ON mb.ROWID = m.mailbox
WHERE m.ROWID = ${message_id}
LIMIT 1;
")"

if [[ "$MESSAGE_JSON" == "[]" ]]; then
  echo "Message id $message_id not found in local Mail index" >&2
  exit 1
fi

extract_json_field() {
  local field="$1"
  /usr/bin/python3 - "$field" "$MESSAGE_JSON" <<'PY'
import json, sys
field = sys.argv[1]
data = json.loads(sys.argv[2])
value = data[0].get(field, "")
if value is None:
    value = ""
print(value)
PY
}

ROWID="$(extract_json_field rowid)"
SOURCE_URL="$(extract_json_field mailbox_url)"
MESSAGE_ID_FIELD="$(extract_json_field message_id)"
GLOBAL_MESSAGE_ID="$(extract_json_field global_message_id)"
DOCUMENT_ID="$(extract_json_field document_id)"
SUBJECT="$(extract_json_field subject)"
SENDER="$(extract_json_field sender)"

ACCOUNT_ID_RAW="${SOURCE_URL#imap://}"
ACCOUNT_ID="${ACCOUNT_ID_RAW%%/*}"
SOURCE_MAILBOX_ENCODED="${SOURCE_URL#imap://${ACCOUNT_ID}/}"
SOURCE_MAILBOX="$(/usr/bin/python3 - "$SOURCE_MAILBOX_ENCODED" <<'PY'
import sys, urllib.parse
print(urllib.parse.unquote(sys.argv[1]))
PY
)"

DEST_MAILBOX="$target_mailbox"
case "$action" in
  archive) DEST_MAILBOX="Archive" ;;
  junk) DEST_MAILBOX="Junk" ;;
  trash) DEST_MAILBOX="Deleted Messages" ;;
esac

if [[ "$action" == "info" ]]; then
  printf '%s\n' "$MESSAGE_JSON"
  exit 0
fi

ACTION_JSON="$(osascript - "$ACCOUNT_ID" "$SOURCE_MAILBOX" "$ROWID" "$action" "$DEST_MAILBOX" <<'APPLESCRIPT'
on json_escape(t)
  set s to t as text
  set s to my replace_text(s, "\\", "\\\\")
  set s to my replace_text(s, "\"", "\\\"")
  set s to my replace_text(s, return, "\\n")
  set s to my replace_text(s, linefeed, "\\n")
  return s
end json_escape

on replace_text(subject_text, search_text, replace_text)
  set old_delims to AppleScript's text item delimiters
  set AppleScript's text item delimiters to search_text
  set text_items to text items of subject_text
  set AppleScript's text item delimiters to replace_text
  set new_text to text_items as text
  set AppleScript's text item delimiters to old_delims
  return new_text
end replace_text

on run argv
  set account_id to item 1 of argv
  set source_mailbox_name to item 2 of argv
  set row_id_text to item 3 of argv
  set action_name to item 4 of argv
  set dest_mailbox_name to item 5 of argv

  tell application "Mail"
    set acc to first account whose id is account_id
    set source_mailbox to mailbox source_mailbox_name of acc
    set msgRef to first message of source_mailbox whose id is (row_id_text as integer)
    set subject_text to subject of msgRef
    set sender_text to sender of msgRef

    if action_name is "flag" then
      set flagged status of msgRef to true
    else if action_name is "unflag" then
      set flagged status of msgRef to false
    else if action_name is "read" then
      set read status of msgRef to true
    else if action_name is "unread" then
      set read status of msgRef to false
    else if action_name is "archive" or action_name is "junk" or action_name is "trash" or action_name is "move" then
      set dest_mailbox to mailbox dest_mailbox_name of acc
      move msgRef to dest_mailbox
    else
      error "Unsupported action: " & action_name
    end if

    delay 1

    set current_mailbox_name to source_mailbox_name
    if action_name is "archive" or action_name is "junk" or action_name is "trash" or action_name is "move" then
      set current_mailbox_name to dest_mailbox_name
    end if

    if action_name is "archive" or action_name is "junk" or action_name is "trash" or action_name is "move" then
      set current_msg to first message of mailbox current_mailbox_name of acc whose subject is subject_text and sender is sender_text
    else
      set current_msg to first message of source_mailbox whose id is (row_id_text as integer)
    end if

    set result_json to "{\"ok\":true,\"account_id\":\"" & my json_escape(account_id) & "\",\"mailbox\":\"" & my json_escape(current_mailbox_name) & "\",\"mail_id\":" & (id of current_msg as text) & ",\"read\":" & ((read status of current_msg) as text) & ",\"flagged\":" & ((flagged status of current_msg) as text) & "}"
    return result_json
  end tell
end run
APPLESCRIPT
)"

NEW_LOCAL_ID="$ROWID"
if [[ "$action" == "archive" || "$action" == "junk" || "$action" == "trash" || "$action" == "move" ]]; then
  DEST_URL_ENCODED="$(/usr/bin/python3 - "$DEST_MAILBOX" <<'PY'
import sys, urllib.parse
print(urllib.parse.quote(sys.argv[1], safe=""))
PY
)"
  DEST_URL="imap://${ACCOUNT_ID}/${DEST_URL_ENCODED}"
  NEW_LOCAL_ID="$(sqlite3 "$DB_PATH" "
SELECT m.ROWID
FROM messages m
JOIN mailboxes mb ON mb.ROWID = m.mailbox
WHERE mb.url = '$DEST_URL'
  AND (
    ('$DOCUMENT_ID' != '' AND m.document_id = '$DOCUMENT_ID')
    OR m.global_message_id = $GLOBAL_MESSAGE_ID
    OR ('$MESSAGE_ID_FIELD' != '0' AND m.message_id = $MESSAGE_ID_FIELD)
  )
ORDER BY m.ROWID DESC
LIMIT 1;
")"
fi

/usr/bin/python3 - "$ACTION_JSON" "$action" "$ROWID" "$NEW_LOCAL_ID" "$SOURCE_MAILBOX" "$DEST_MAILBOX" "$SUBJECT" "$SENDER" <<'PY'
import json, sys
action_json, action, original_id, new_id, source_mailbox, dest_mailbox, subject, sender = sys.argv[1:]
payload = json.loads(action_json)
payload["action"] = action
payload["original_id"] = int(original_id)
payload["new_id"] = int(new_id) if new_id.strip() else int(original_id)
if action in {"archive", "junk", "trash", "move"}:
    payload["mail_id"] = payload["new_id"]
payload["source_mailbox"] = source_mailbox
payload["subject"] = subject
payload["sender"] = sender
if action in {"archive", "junk", "trash", "move"}:
    payload["destination_mailbox"] = dest_mailbox
print(json.dumps(payload, ensure_ascii=True))
PY
