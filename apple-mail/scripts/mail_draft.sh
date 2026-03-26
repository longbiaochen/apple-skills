#!/usr/bin/env bash
set -euo pipefail

show_help() {
  cat <<'EOF'
Usage:
  mail_draft.sh --to alice@example.com --subject "Hello" --body "Hi"
  mail_draft.sh --to alice@example.com,bob@example.com --subject "Status" --body "Update" --send

Options:
  --to <csv>        Comma-separated To recipients (required)
  --cc <csv>        Comma-separated CC recipients
  --bcc <csv>       Comma-separated BCC recipients
  --subject <text>  Subject line
  --body <text>     Plain-text body
  --send            Send immediately instead of saving as a draft
  -h, --help        Show this help
EOF
}

to_csv=""
cc_csv=""
bcc_csv=""
subject=""
body=""
send_now="0"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --to)
      to_csv="${2:-}"
      shift 2
      ;;
    --cc)
      cc_csv="${2:-}"
      shift 2
      ;;
    --bcc)
      bcc_csv="${2:-}"
      shift 2
      ;;
    --subject)
      subject="${2:-}"
      shift 2
      ;;
    --body)
      body="${2:-}"
      shift 2
      ;;
    --send)
      send_now="1"
      shift
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

if [[ -z "$to_csv" ]]; then
  echo "--to is required" >&2
  show_help >&2
  exit 1
fi

osascript - "$subject" "$body" "$to_csv" "$cc_csv" "$bcc_csv" "$send_now" <<'APPLESCRIPT'
on split_csv(csv_text)
  if csv_text is "" then return {}
  set old_delims to AppleScript's text item delimiters
  set AppleScript's text item delimiters to ","
  set raw_items to text items of csv_text
  set AppleScript's text item delimiters to old_delims
  set cleaned to {}
  repeat with item_text in raw_items
    set trimmed to my trim_text(item_text as text)
    if trimmed is not "" then set end of cleaned to trimmed
  end repeat
  return cleaned
end split_csv

on trim_text(t)
  set s to t
  repeat while s begins with " " or s begins with tab
    set s to text 2 thru -1 of s
  end repeat
  repeat while s ends with " " or s ends with tab
    set s to text 1 thru -2 of s
  end repeat
  return s
end trim_text

on add_recipients(message_ref, recipient_kind, csv_text)
  set recipients_list to my split_csv(csv_text)
  repeat with addr in recipients_list
    if recipient_kind is "to" then
      tell application "Mail" to make new to recipient at end of to recipients of message_ref with properties {address:(addr as text)}
    else if recipient_kind is "cc" then
      tell application "Mail" to make new cc recipient at end of cc recipients of message_ref with properties {address:(addr as text)}
    else if recipient_kind is "bcc" then
      tell application "Mail" to make new bcc recipient at end of bcc recipients of message_ref with properties {address:(addr as text)}
    end if
  end repeat
end add_recipients

on run argv
  set subject_text to item 1 of argv
  set body_text to item 2 of argv
  set to_csv to item 3 of argv
  set cc_csv to item 4 of argv
  set bcc_csv to item 5 of argv
  set send_now to item 6 of argv

  tell application "Mail"
    activate
    set new_message to make new outgoing message with properties {subject:subject_text, content:body_text, visible:true}
    my add_recipients(new_message, "to", to_csv)
    my add_recipients(new_message, "cc", cc_csv)
    my add_recipients(new_message, "bcc", bcc_csv)

    if send_now is "1" then
      send new_message
      return "sent"
    else
      save new_message
      return "drafted"
    end if
  end tell
end run
APPLESCRIPT
