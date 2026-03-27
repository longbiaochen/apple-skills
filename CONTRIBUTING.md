# Contributing

Thanks for contributing.

## Repo Structure

- `apple-ecosystem/`: top-level routing skill
- `apple-mail/`: Mail skill plus helper scripts
- `apple-notes/`: Notes skill
- `apple-reminders/`: Reminders skill
- `apple-plugin/`: Codex-local plugin, MCP server, and plugin-facing skill
- `docs/agent-contract.md`: shared cross-agent invariants
- `docs/launch/`: community launch copy and announcement drafts

`SKILL.md` is the public interface for each skill. Keep instructions concrete, tool-specific, and safe for local execution. Root files such as `README.md`, `AGENTS.md`, and `CLAUDE.md` are adapters and install docs; they must mirror the skills instead of redefining behavior.

## Contribution Rules

- Preserve the local-first design.
- Prefer native macOS automation or existing Apple app CLIs over browser automation.
- Keep new guidance portable. Avoid machine-specific paths unless a tool truly depends on them.
- Document permission requirements clearly when a tool needs Automation, Full Disk Access, or app authorization.
- Treat destructive actions as high-risk and require explicit confirmation in the skill guidance.
- Start behavior changes in the relevant `SKILL.md` and any linked `references/` files first.
- Sync `apple-plugin/` after canonical skill changes so the plugin MCP tools and install docs remain aligned.
- Sync `README.md`, `AGENTS.md`, `CLAUDE.md`, and `agents/openai.yaml` after canonical skill changes.
- Do not let agent-specific adapters change routing, tool choice, or safety defaults unless the canonical skill changes first.
- Do not let the plugin MCP server drift away from the canonical root skills.

## Testing

Before opening a pull request:

```bash
bash -n apple-mail/scripts/mail_draft.sh
bash -n apple-mail/scripts/mail_action.sh
./apple-mail/scripts/mail_draft.sh --help
./apple-mail/scripts/mail_action.sh --help
npm --prefix apple-plugin install
npm --prefix apple-plugin run check
npm --prefix apple-plugin run doctor
```

Also verify:

- every command example in changed docs is syntactically correct
- every `references/` document is linked directly from its `SKILL.md`
- every `agents/openai.yaml` matches the current `SKILL.md`
- any new dependency is documented in `README.md`
- any macOS permission requirement is documented

## Adding Another Apple Skill

If you add support for another Apple app:

1. Create a new skill directory with a focused `SKILL.md`.
2. Keep `SKILL.md` concise and move overflow details into `references/` only when needed.
3. Add `agents/openai.yaml` for the new skill.
4. Keep the toolchain local-first and macOS-native.
5. Update `apple-ecosystem/SKILL.md` so routing stays clear.
6. Update `docs/agent-contract.md` if shared invariants change.
7. Update adapter and install docs in `README.md`, `AGENTS.md`, and `CLAUDE.md`.
8. Add validation steps for the new skill.
