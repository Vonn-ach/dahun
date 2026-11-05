# Prompt 04: Learning path, sentences, spaced repetition

```
READ FIRST: CLAUDE.md, docs/PEDAGOGY.md (SRS, practice sessions), docs/ARCHITECTURE.md (storage), src/engine/, src/features/lesson/, docs/PROGRESS.md.

GOAL: Progress persists between visits. The home screen is a learning path, and a "Practice" button runs time-boxed spaced-repetition rounds that mix in new words.

BUILD:
1. src/storage/db.ts (Dexie, schema version 1): tables progress, days, settings and meta, as in ARCHITECTURE.md. Implement ProgressRepo from prompt 03 on top of it. Add a migration test pattern.
2. src/engine/scheduler.ts: Leitner boxes with intervals [0,1,2,4,8,16,32] days. Correct → +1 box (a fresh item goes to box 1), wrong → box 1 and due in 4 h, hint used → box unchanged and due in +1 day. Pure, with `now` passed in. Tested.
3. src/engine/practice.ts: buildPracticeRound({minutes, unitId?}, entries, progress, rng, now) → a queue builder that yields due items first (oldest due), then new entries (cap 2/5/8 by length, extended for beginners with fewer than 10 seen entries), then the lowest-box seen entries. Exercise type is chosen by box (see PEDAGOGY). It also includes malay-bridge for entries with malayCognate: true.
4. src/engine/exercises/buildSentence.ts + the BuildSentence component: tap tokens into slots, tap a slot token to remove it, Check. Tokens come from sentences.json. Show source badges, and a "practice sentence, check with a speaker" badge when constructed is true.
5. Home (/) = learning path: units as cards in order, with a title (EN/MS per locale), a tagline from taglineEntries, bead progress (one bead per entry, coloured by level) and lessons as tappable nodes (done / current / open). Any unit can be opened. The current lesson is highlighted. A sticky "Start a 5-minute round" button sits at the top, with 2/5/10 chips.
6. /practice: a timer bar, then the same LessonPlayer UI driven by the practice queue. When time is up, finish the current item and show the summary ("Done for now" is the main button, "One more round" the secondary one).

CONSTRAINTS:
- Progress is keyed by entry id. Never by index.
- A learner can never get stuck: if nothing is due and the course is finished, offer review of the lowest-box items.

ACCEPTANCE:
- Unit tests for the scheduler and practice builder (including the beginner extension and the empty-pool fallback).
- Playwright: finish a lesson, reload, and the beads and current lesson persist. A 2-minute practice round with time mocked ends at the summary.
- Works offline once loaded. Check in DevTools with "Offline" ticked.

FINISH: Update docs/PROGRESS.md and commit ("feat: path, practice rounds, persistence").
```
