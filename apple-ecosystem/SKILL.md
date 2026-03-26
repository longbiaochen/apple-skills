---
name: apple-ecosystem
description: Use a local Apple app toolchain on macOS. Route Apple Notes tasks to `apple-notes`, Apple Reminders tasks to `apple-reminders`, and Apple Mail tasks to `apple-mail`. Use when the user asks to work with Notes, Reminders, or Mail.app on a Mac.
---

# Apple Ecosystem

Use the local Apple app toolchain already available on macOS. Prefer the app-specific skills instead of inventing new workflows.

Use this routing:

- Notes or Apple Notes app -> `apple-notes`
- Reminders or Apple Reminders app -> `apple-reminders`
- Mail.app, Apple Mail, inbox triage, draft/send/search email -> `apple-mail`

Expected local tools:

- `memo` for Apple Notes
- `remindctl` for Apple Reminders
- `fruitmail` for fast Apple Mail search/read
- `osascript`, `sqlite3`, and `shortcuts` for native macOS automation

Rules:

- Prefer local Apple app workflows over browser automation when a local CLI exists.
- Keep data local-first. Do not introduce third-party APIs or OAuth when the request can be completed through Apple apps already configured on the machine.
- For write actions in Mail.app, Reminders, or Notes, preview or confirm high-risk actions before executing them.
