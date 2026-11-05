# The prompt framework

This folder is a sequence of prompts. Each one is sized for **one Claude Code session**. Paste them in order. Together with `CLAUDE.md` (which Claude Code reads automatically) they keep every session on the same rails.

## The session loop

```
/clear  →  paste prompt NN  →  Claude reads docs + plans  →  you approve or adjust the plan
        →  Claude builds in small steps, running tests as it goes
        →  you try it (phone + laptop)  →  /ship-check  →  /session-wrap (updates PROGRESS.md, commits)
```

1. **One prompt per session.** Start fresh with `/clear` so old context doesn't leak in.
2. **Plan first.** Every prompt asks for a plan before code. Use plan mode (press Shift+Tab until it shows "plan mode") if you want Claude to read without writing anything.
3. **Approve with edits.** Reply "go", or "go, but skip X / use Y".
4. **Try it yourself** before wrapping up: `npm run dev`, then open the URL on your phone (same Wi-Fi, use the `Network:` URL Vite prints).
5. **Wrap up.** `/session-wrap` logs what happened and commits. Push when you're happy.

## Anatomy of every prompt

| Section | Purpose |
|---|---|
| **Read first** | Which docs and files to load, so Claude doesn't guess |
| **Goal** | One sentence on what "done" looks like for the user |
| **Build** | The concrete scope, in order |
| **Constraints** | Golden rules and things not to do this session |
| **Acceptance** | Checklist used to decide whether the session succeeded |
| **Verify** | Commands to run and manual checks |
| **Finish** | Update PROGRESS.md, propose a commit |

## Index

| # | Prompt | Phase |
|---|---|---|
| 00 | `00-kickoff.md`: read everything, find gaps, agree the plan | 0 |
| 01 | `01-scaffold.md`: project, tooling, CI, design tokens | 1 |
| 02 | `02-content-pipeline.md`: validation, typed bundle, status gating | 1 |
| 03 | `03-lesson-player.md`: exercise engine + lesson screen | 1 |
| 04 | `04-path-practice.md`: learning path, sentences, spaced-repetition rounds | 1 |
| 05 | `05-progress-settings.md`: XP, beads, practice days, backup, settings | 1 |
| 06 | `06-audio.md`: audio playback, listen exercises, caching | 2 |
| 07 | `07-offline-pwa.md`: offline + install | 1 |
| 08 | `08-a11y-i18n.md`: accessibility + Bahasa Malaysia UI | 1 |
| 09 | `09-deploy-showcase.md`: hosting, CI deploy, README, demo assets | 1 |
| 10 | `10-speaker-review-tool.md`: offline tool for speakers to check and record | 2 |
| 11 | `11-accounts-sync.md`: Supabase auth + progress sync | 3 |
| 12 | `12-ai-content-assistant.md`: server-side AI drafts into the review queue | 3 |
| 13 | `13-android.md`: Capacitor build + Play Store | 4 |
| 14 | `14-second-language.md`: add a new language pack | 5 |

Templates for day-to-day work are in `templates/` (feature, bug fix, code review, content batch).

## Slash commands in this repo (`.claude/commands/`)

| Command | What it does |
|---|---|
| `/validate-content` | Runs content validation and explains any errors, without editing language text |
| `/new-lesson <unit> <entry ids…>` | Adds a lesson to `course.json` using existing entries only |
| `/new-language <iso> "<English>" "<Malay>"` | Scaffolds a new language pack folder |
| `/ship-check` | Lint, types, tests, e2e, build, content checks, a quick audit, then a go/no-go |
| `/session-wrap` | Updates `docs/PROGRESS.md`, summarises the session, commits |

Subagent: **content-guardian** (`.claude/agents/`) audits a diff for invented or altered indigenous-language text. Claude Code uses it on its own when content changes, or you can ask: "use the content-guardian on this diff".

## Tips

- If Claude starts to drift, stop it (Esc) and say: "Stop. Re-read CLAUDE.md and the prompt. What's the smallest next step?"
- Long session getting slow? Use `/compact`, or finish with `/session-wrap` and start fresh.
- Never let a session end with failing tests and no commit. Ask for "the smallest change that makes tests green, then wrap".
- Keep the prompts in the repo, and edit them as you learn what works. They are part of the project.
