# Getting started (for you, the human)

Two tracks run side by side: **build** (you + Claude Code) and **content** (you + Kayan speakers). The app is only as good as the content track, so start both this week.

## Step 1: Tools (about 1 hour, Windows)

1. Install **Git for Windows** and **Node.js LTS**. Check with `git --version` and `node -v`.
2. Install **VS Code** (optional but handy).
3. Install **Claude Code** following the official guide at docs.claude.com (Claude Code → Getting started). It needs a Claude Pro or Max plan, or an Anthropic API key. Open a terminal in your project folder and run `claude` to check it starts.
4. Create a **GitHub** account if you don't have one, and sign in with `gh auth login` (GitHub CLI) or through VS Code.

## Step 2: Repo (15 minutes)

1. On GitHub, create a **public** repo called `dahun`. The Rakyat Builders Hub tracks your building through GitHub, so public commits count.
2. Clone it, copy everything from this kit into it, then:
   ```
   git add -A
   git commit -m "Add Dahun starter kit: docs, prompts, schemas, Kayan seed, speaker kit"
   git push
   ```
3. In the repo settings, add a description ("Learn Kayan and other Borneo languages, 5 minutes a day") and the topics `language-learning`, `indigenous-languages`, `sarawak`, `kayan`, `pwa`.

## Step 3: Rakyat Builders Hub (15 minutes)

- Finish your builder profile on rakyatdigital.gov.my and link the GitHub repo.
- Post the project as "in progress". Update it after each phase gate with a screenshot and the demo link (from prompt 09).

## Step 4: Build with Claude Code (one prompt per session)

Read `prompts/README.md` once. Then, per session:

1. Open a terminal in the repo and run `claude`.
2. Type `/clear` if it's not a fresh session.
3. Paste the next prompt from `prompts/` (start with `00-kickoff.md`).
4. Let it plan, check the plan, say "go", and test what it built on your phone.
5. End with `/session-wrap`. It updates `docs/PROGRESS.md` and commits.

## Step 5: Content track (start this week)

1. Read `docs/ETHICS_AND_DATA.md` and `speaker-kit/SESSION_GUIDE.md`.
2. Make a list of 3–5 possible speakers: relatives, church members, Kayan student or community groups in the Klang Valley, and contacts in Baram or Belaga. Aim for at least one elder and one fluent younger adult.
3. Print or share `speaker-kit/consent-form.md` and open `speaker-kit/verification-sheet.csv` in Google Sheets or Excel.
4. First session: 60 minutes, about 50 entries (Units 1–3). Record audio on your phone at the same time.

## Your first two weeks

| Day | Build track | Content track |
|---|---|---|
| 1 | Steps 1–3 | Message 3 possible speakers |
| 2 | Prompt 00 (kickoff) | — |
| 3–4 | Prompt 01 (scaffold) | Book session 1 |
| 5–6 | Prompt 02 (content pipeline) | Session 1: Units 1–3 |
| 7 | Rest / catch up | Enter session 1 results into the sheet |
| 8–10 | Prompt 03 (lesson player) | Session 2: Units 4–6 |
| 11–12 | Prompt 04 (path + practice) | — |
| 13 | `/ship-check`, post an update to the Builders Hub | Session 3: Units 7–9 |
| 14 | Rest | — |

Missing days is fine. `docs/PROGRESS.md` always tells you (and Claude) where you left off.

## When you get stuck

- Ask Claude Code: "Read docs/PROGRESS.md and tell me the smallest next step."
- For errors, use `prompts/templates/bugfix.md`.
- If a session goes off the rails, go back to your last commit with `git restore .` (this throws away uncommitted changes) and start again with `/clear`. Committing after every green step keeps this cheap.
