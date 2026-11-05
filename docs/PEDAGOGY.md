# Teaching design

## Lesson anatomy (about 3 minutes, 10–14 steps)

1. **Introduce** each new entry: big form, meaning (EN/MS), audio if available, note, dialect and source badges.
2. **Recognise**: pick the meaning (target → gloss).
3. **Recall**: pick the word (gloss → target), match pairs.
4. **Produce**: type the word (only for entries the learner has answered correctly at least twice).
5. **Use**: build a sentence from a word bank, when the lesson has sentences.
6. **Finish**: summary of answers, accuracy, new words, XP, and the beads earned. Offer "Done" as the main button and "One more" as the secondary one.

Wrong answers are re-asked once, 2–3 steps later, in an easier format.

## Exercise types

| Type | Shown when | Notes |
|---|---|---|
| `intro` | New entry | No grading |
| `pick-meaning` | Box 0–2 | 4 options, distractors from the same unit first |
| `pick-word` | Box 1+ | Glottal stops highlighted in options |
| `match-pairs` | 4+ seen entries in lesson | 4–5 pairs, tap to pair |
| `type-word` | Box 3+ | Lenient matching (see CONTENT_MODEL), "Hint" reveals letters (half XP), "Show me" counts as wrong |
| `build-sentence` | Lesson has sentences | Tap tokens into order; no distractor tokens at first, add 1–2 later |
| `listen-pick` | Entry has audio | Play audio, pick the written form |
| `malay-bridge` | `malayCognate: true`, box 1+ | Malay word → pick the Kayan cousin |
| `speak-compare` (Phase 2) | Entry has audio | Learner records themselves, then plays both back. Self-graded. No speech recognition |

## Spaced repetition

- Leitner boxes. Intervals in days: box 1 = 1, 2 = 2, 3 = 4, 4 = 8, 5 = 16, 6 = 32.
- Correct answer: box +1. Wrong answer: back to box 1, due again in 4 hours, and re-asked once in the session.
- Levels shown to learners: New (0), Learning (1–2), Known (3–4), Long-term (5–6).
- Practice sessions are time-boxed (2/5/10 min): due reviews first, then up to N new entries (2/5/8). If a beginner has fewer than 10 seen entries, keep adding new ones instead of drilling the same five.

## XP and progress

- 10 XP for a correct answer, plus a combo bonus of up to +10. 5 XP if a hint was used.
- **No hearts or lives.** Mistakes never block progress.
- Show "practised X of the last 7 days" instead of a streak counter that resets. If a streak is ever added, freezes are automatic and the copy never shames.
- Unit progress uses a string of beads (Orang Ulu beadwork) with one bead per entry, coloured by level.

## Neuro-inclusive design (good for everyone)

- One obvious main action on every screen. "Start a 5-minute round" works with a single tap or Enter.
- Short sessions are the default. Stopping is presented as success ("That counts").
- **Calm mode**: no animation, no auto-advance, no sound. Sound effects are off by default.
- Keyboard shortcuts on desktop: 1–4 to pick options, Enter to continue, Esc to end the round.
- Large, legible type (Atkinson Hyperlegible for body text). Never rely on colour alone.
- Let learners jump to any unit. Interest beats a forced order.
- Copy is plain and friendly, with no guilt or urgency language.

## Dialects

- Onboarding asks: "Which Kayan do you want to learn? Baram / Belaga / Not sure (Baram)".
- Entries in the other dialect are still taught when the chosen dialect has no form, with a badge such as "Belaga form".
- Variants are always accepted as typed answers.

## Praise and UI phrases in the language

Use short phrases from content, referenced by entry id in `language.json → uiPhrases` (for Kayan, "Sayu!" = good). Never write language text directly in i18n files.
