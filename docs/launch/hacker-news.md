Show HN: Codex Apple Skills, a local-first macOS skill pack for Notes, Reminders, and Mail

I packaged a small set of Codex skills I use on macOS into an open-source repo:

- Apple Notes via `memo`
- Apple Reminders via `remindctl`
- Apple Mail via `fruitmail` and a pair of AppleScript-backed helper scripts

The goal is to make AI workflows use the Apple apps already configured on a Mac instead of defaulting to browser automation or provider APIs.

The package is intentionally narrow. It focuses on:

- local-first execution
- explicit permission/setup guidance
- reusable `SKILL.md` files
- practical Mail drafting and exact-message actions

One caveat: the Mail action helper currently assumes Apple Mail's V10 Envelope Index path/schema, so portability feedback across macOS versions would be useful.

Repo: https://github.com/longbiaochen/apple-skills
