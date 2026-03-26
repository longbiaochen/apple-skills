Built and open-sourced `apple-skills`: a local-first Apple app skill pack for coding agents on macOS.

It now works as a canonical skill pack for:
- Codex / OpenAI skills
- Claude-style agent workflows
- AGENTS-style runtimes such as OpenClaw

It routes tasks across:
- Apple Notes via `memo`
- Apple Reminders via `remindctl`
- Apple Mail via `fruitmail` + AppleScript helpers

The point is simple: use the apps already on your Mac instead of defaulting to browser automation or new OAuth flows.

Canonical behavior stays in the skill folders. Repo-level `AGENTS.md` and `CLAUDE.md` adapt the same behavior for other runtimes.

Repo: https://github.com/longbiaochen/apple-skills
