# Contributing

Thanks for contributing.

## Repo Structure

- `apple-ecosystem/`: top-level routing skill
- `apple-mail/`: Mail skill plus helper scripts
- `apple-notes/`: Notes skill
- `apple-reminders/`: Reminders skill
- `docs/launch/`: community launch copy and announcement drafts

`SKILL.md` is the public interface for each skill. Keep instructions concrete, tool-specific, and safe for local execution.

## Contribution Rules

- Preserve the local-first design.
- Prefer native macOS automation or existing Apple app CLIs over browser automation.
- Keep new guidance portable. Avoid machine-specific paths unless a tool truly depends on them.
- Document permission requirements clearly when a tool needs Automation, Full Disk Access, or app authorization.
- Treat destructive actions as high-risk and require explicit confirmation in the skill guidance.

## Testing

Before opening a pull request:

```bash
bash -n apple-mail/scripts/mail_draft.sh
bash -n apple-mail/scripts/mail_action.sh
./apple-mail/scripts/mail_draft.sh --help
./apple-mail/scripts/mail_action.sh --help
```

Also verify:

- every command example in changed docs is syntactically correct
- any new dependency is documented in `README.md`
- any macOS permission requirement is documented

## Adding Another Apple Skill

If you add support for another Apple app:

1. Create a new skill directory with a focused `SKILL.md`.
2. Keep the toolchain local-first and macOS-native.
3. Update `apple-ecosystem/SKILL.md` so routing stays clear.
4. Add install and usage documentation to `README.md`.
5. Add validation steps for the new skill.
