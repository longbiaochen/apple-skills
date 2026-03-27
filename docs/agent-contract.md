# Apple Skills Agent Contract

`apple-skills` is a multi-agent macOS skill pack. The canonical behavior lives in the four root skill folders:

- `apple-ecosystem`
- `apple-mail`
- `apple-notes`
- `apple-reminders`

Root adapter docs such as `README.md`, `AGENTS.md`, and `CLAUDE.md` must mirror those skills and must not redefine behavior.

The Codex-local `apple-plugin` packages these workflows into one plugin and MCP server, but it must follow the same routing and safety defaults.

## Shared Invariants

- Keep workflows local-first on macOS.
- Use the existing Apple apps and local CLIs before browser automation or third-party APIs.
- Route Notes requests to `apple-notes` and use `memo`.
- Route Reminders requests to `apple-reminders` and use `remindctl`.
- Route Mail search and read requests to `apple-mail` and use `fruitmail`.
- Route Mail drafts, sends, and exact-message actions to `apple-mail` helper scripts or AppleScript when needed.
- Draft email before send unless the user explicitly asks to send.
- Confirm destructive or ambiguous actions before executing them.
