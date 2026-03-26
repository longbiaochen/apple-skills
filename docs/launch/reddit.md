Title: Open-source Codex skills for Apple Notes, Reminders, and Mail on macOS

Body:

I packaged four Codex skills I’ve been using into a public repo:

- `apple-ecosystem`
- `apple-notes`
- `apple-reminders`
- `apple-mail`

They use local macOS tools instead of web automation:

- `memo` for Notes
- `remindctl` for Reminders
- `fruitmail` plus helper scripts for Mail

The repo includes install docs, permission guidance, usage recipes, and launch copy. It is meant for people who want practical local-first AI workflows on a Mac.

One known limitation is that the Mail action helper is tied to Apple Mail's current V10 Envelope Index path/schema, so I documented that rather than hiding it.

Repo: https://github.com/longbiaochen/codex-apple-skills
