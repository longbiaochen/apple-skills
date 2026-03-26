# Launch Post

I open-sourced `apple-skills`, a focused local-first Apple app skill pack for coding agents on macOS.

What it includes:

- four canonical skill surfaces:
  - `apple-ecosystem`
  - `apple-notes`
  - `apple-reminders`
  - `apple-mail`
- Codex-compatible `SKILL.md` entrypoints that remain the source of truth
- repo-level adapters for `AGENTS.md` runtimes and Claude
- OpenAI skill metadata in `agents/openai.yaml` for each skill

Why I built it:

- local-first workflows are easier to trust and debug
- many Apple productivity tasks do not need browser automation
- coding agents become much more useful when they reuse the apps and accounts already configured on the machine

The repo includes install and consumption docs for Codex, Claude, and AGENTS-style runtimes such as OpenClaw, plus permission guidance and usage recipes.

Feedback on portability, Mail schema differences, and additional Apple app skills is welcome.

Repo: https://github.com/longbiaochen/apple-skills
