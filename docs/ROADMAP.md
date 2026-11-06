# Roadmap

Every phase ends with a **gate**: concrete checks that must be true before starting the next phase. Each prompt in `prompts/` is sized for one Claude Code session of about 1–3 hours.

## Phase 0: Set up (week 1)

- [ ] Tools installed, repo created and public, kit committed (see `GETTING_STARTED.md`)
- [ ] Rakyat Builders Hub profile done and repo linked
- [ ] 2–3 Badeng Kenyah speakers (besides the owner) contacted. First verification session booked (`speaker-kit/`)
- [ ] Prompt **00** run: Claude Code has read the docs and agreed the plan in `docs/PROGRESS.md`

**Gate:** the plan is agreed and at least one speaker session is scheduled.

## Phase 1: MVP, text-only (weeks 2–6)

| Prompt | Delivers |
|---|---|
| 01 | Project scaffold, tooling, CI, design tokens, empty routes |
| 02 | Content pipeline: schema validation, typed bundle, draft/verified filtering |
| 03 | Lesson player + exercise engine (intro, pick-meaning, pick-word, type-word, match-pairs) |
| 04 | Learning path, sentence builder, spaced-repetition practice sessions |
| 05 | Progress, XP, practice-days view, beads, backup/restore, settings |
| 07 | Offline PWA + install prompt |
| 08 | Accessibility pass + BM/EN UI |
| 09 | Deploy to the web + README and showcase assets |

**Gate:** a stranger can install the app on an Android phone, finish Unit 1 offline, and back up their progress. CI is green. Lighthouse Accessibility and PWA scores are both at least 90.

## Phase 2: Real content (weeks 6–12, partly in parallel with Phase 1)

| Prompt | Delivers |
|---|---|
| 06 | Audio: playback, listen-pick, audio checks in validation, caching |
| 10 | Speaker review tool (local, file-based): mark entries ok/fix, record audio, export a changeset |
| — | Speaker sessions: verify the seed (210 entries), add about 100 more, record audio |

**Gate:** at least 300 entries verified, at least 150 with audio, 20 beta testers, and written support from a community body. Then do a **public launch** (release build).

## Phase 3: Accounts, sync, contributors (months 3–5)

| Prompt | Delivers |
|---|---|
| 11 | Supabase auth + progress sync (merge, like backup/restore) |
| 12 | AI content assistant (server-side, review-queue only) |

**Gate:** 50+ weekly active learners, and a working review loop with at least 3 remote contributors.

## Phase 4: Android app (month 5–6)

| Prompt | Delivers |
|---|---|
| 13 | Capacitor wrapper, bundled offline content, Play Store listing |

## Phase 5: Second language (month 6+)

| Prompt | Delivers |
|---|---|
| 14 | Add a second language pack (e.g. Kayan from the `kayan-seed-v1` tag, Iban or Bidayuh) with a partner community. Another Kenyah variety is a dialect in the `xkl` pack, not a new pack |

**Start only if:** Kenyah has at least 500 verified entries, at least 50 weekly learners, and a partner from the new language community has agreed to lead its content. The code should need no changes. If it does, fix the abstraction first.
