Show HN: Apple Skills, a local-first macOS skill pack for coding agents

I packaged a small set of Apple app skills I use on macOS into an open-source repo:

- Apple Notes via `memo`
- Apple Reminders via `remindctl`
- Apple Mail via `fruitmail` and a pair of AppleScript-backed helper scripts

The goal is to make agent workflows use the Apple apps already configured on a Mac instead of defaulting to browser automation or provider APIs.

The package is intentionally narrow. It focuses on:

- local-first execution
- explicit permission and setup guidance
- canonical `SKILL.md` files as the source of truth
- repo-level adapters for Claude and AGENTS-style runtimes
- practical Mail drafting and exact-message actions

One caveat: the Mail action helper currently assumes Apple Mail's V10 Envelope Index path/schema, so portability feedback across macOS versions would be useful.

Repo: https://github.com/longbiaochen/apple-skills
