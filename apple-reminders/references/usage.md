# Apple Reminders Reference

## Common Commands

```bash
remindctl show
remindctl today
remindctl tomorrow
remindctl week
remindctl overdue
remindctl all
remindctl list
remindctl list Work
remindctl add "Buy milk"
remindctl add --title "Call mom" --list Personal --due tomorrow
remindctl complete 1 2 3
remindctl delete 4A83 --force
```

## Accepted Date Formats

- `today`, `tomorrow`, `yesterday`
- `YYYY-MM-DD`
- `YYYY-MM-DD HH:mm`
- ISO 8601
