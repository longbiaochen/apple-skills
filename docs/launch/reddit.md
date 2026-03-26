Title: Open-source Apple app skills for coding agents on macOS

Body:

I packaged four Apple app skills I’ve been using into a public repo:

- `apple-ecosystem`
- `apple-notes`
- `apple-reminders`
- `apple-mail`

They use local macOS tools instead of web automation:

- `memo` for Notes
- `remindctl` for Reminders
- `fruitmail` plus helper scripts for Mail

The repo now treats the skill folders as canonical and adds repo-level adapters for Claude and `AGENTS.md` runtimes like OpenClaw, so the same local-first behavior works across multiple coding agents.

The repo includes install docs, permission guidance, usage recipes, and launch copy. It is meant for people who want practical local-first agent workflows on a Mac.

One known limitation is that the Mail action helper is tied to Apple Mail's current V10 Envelope Index path/schema, so I documented that rather than hiding it.

Repo: https://github.com/longbiaochen/apple-skills
