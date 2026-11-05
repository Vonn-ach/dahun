# Prompt 03: Exercise engine + lesson player

```
READ FIRST: CLAUDE.md, docs/PEDAGOGY.md (lesson anatomy, exercise types), docs/ARCHITECTURE.md (engine), src/content/, docs/PROGRESS.md.

GOAL: A learner can open a lesson, go through about 12 steps (intro → recognise → recall → produce) and see a summary. All logic lives in a pure, tested engine.

BUILD (engine first, UI second):
1. src/engine/rng.ts: a seeded PRNG (mulberry32) + shuffle/sample helpers.
2. src/engine/answers.ts: checkTyped(input, entry, orthography) → 'exact' | 'close' | 'wrong', using language.json normalization rules (lowercase, apostrophe unification, optional diacritic stripping, punctuation, ignoreInLooseMatch). Variants are accepted.
3. src/engine/exercises/: generators for intro, pick-meaning, pick-word, match-pairs and type-word. Each returns a serialisable Exercise. Distractor rules: same unit first, then same tags, then anything. Never use the same gloss (or the same loose form) as the target. Always produce 4 options, or fewer only if the pool is too small.
4. src/engine/lessonPlan.ts: buildLessonPlan(lesson, entries, progress, rng) → Exercise[] following the PEDAGOGY anatomy, with wrong answers re-queued once, 2–3 steps later, in an easier format.
5. Unit tests: answer matching (including "ata" vs "ata'", "amé" vs "ame", variants), distractor uniqueness, deterministic plans for a fixed seed, and the re-queue behaviour. Aim for at least 90% coverage of src/engine.
6. UI in src/features/lesson/: a LessonPlayer screen with a progress bar, an "End" button, one component per exercise type, a feedback panel (correct = the language's praise phrase from uiPhrases, falling back to the i18n "Correct!" if it's missing; wrong = show the right answer), and a summary screen (answers, accuracy, new words, XP, beads).
   - Highlight the glottal stop in displayed forms (a <span class="gs">). Keep the original character.
   - Keyboard: 1–4 pick, Enter continue, Esc end. Auto-advance 900 ms after a correct answer unless calm mode is on.
   - Draft entries show a small "draft" badge in draft builds.
7. For now, record results in memory and log them. Persistence comes in prompt 04/05, through a thin interface `ProgressRepo` that you define now.
8. Playwright: open Unit 1 Lesson 1 in a draft build and complete it by choosing correct answers (read the correct option from a data-testid in test mode only).

CONSTRAINTS:
- Nothing in the engine imports React, the DOM or Date.now().
- No Kayan text in code or i18n files. Every target-language string comes from the bundle.

ACCEPTANCE:
- Engine tests pass. A lesson plays end to end on the phone at 360px, with the keyboard on desktop, and in calm mode.
- Exercises never show duplicate options or an option identical to the prompt.

FINISH: Update docs/PROGRESS.md and commit ("feat(lesson): engine + player").
```
