# Content model

All course content lives in `content/languages/<iso-639-3>/`. Schemas are in `schemas/`. `npm run validate:content` must pass before any commit that touches content.

```
content/languages/kys/
  language.json     name, dialects, orthography and answer-matching rules, UI phrases (by entry id), credits
  lexicon.json      sources + entries (words and phrases)
  sentences.json    example and practice sentences
  course.json       units → lessons, referencing lexicon and sentence ids
  audio/            <entry-id>__<speaker-id>.m4a (or .mp3/.ogg), 44.1 or 48 kHz mono
```

## Entry (lexicon.json → `entries[]`)

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Stable ID, `kys-0001`. **Never reuse or renumber.** Learner progress is keyed on it. |
| `form` | yes | The form as written in the chosen dialect, exactly as the speaker gave it. |
| `kind` | yes | `word` or `phrase` |
| `pos` | no | `noun`, `verb`, `adjective`, `pronoun`, `number`, `question`, `particle`, `phrase`, `other` |
| `gloss.en`, `gloss.ms` | yes | Meanings in English and Malay |
| `dialect` | yes | One of the dialect ids in `language.json` (e.g. `baram`, `belaga`), or `general` |
| `variants[]` | no | Other spellings or dialect forms. Each one is accepted as a typed answer and shown as "Also:" |
| `note.en`, `note.ms` | no | Usage notes, literal meaning, warnings |
| `sources[]` | yes | Keys into `lexicon.json → sources` |
| `constructed` | yes | `true` if it was assembled from dictionary words rather than taken from a speaker or source. Must be checked by a speaker before release. |
| `status` | yes | `draft` → `speaker-checked` → `verified` (or `retired`) |
| `review[]` | no | `{ speaker, date, verdict: "ok" \| "fix" \| "unsure", comment }` |
| `audio[]` | no | `{ file, speaker, dialect }` |
| `malayCognate` | no | `true` if it is a recognisable cousin of a Malay word (used by the "Malay bridge" exercise) |
| `tags[]` | no | Topic tags (`greetings`, `food`…) |

### Status rules

- `draft`: from a written source or constructed. Dev builds only, with a "draft" badge.
- `speaker-checked`: one fluent speaker confirmed it (recorded in `review[]`).
- `verified`: two speakers confirmed it, or one speaker plus agreement with a reliable source. **Only verified content ships in release builds.**
- `retired`: kept for ID stability, never shown.

## Sentences (sentences.json → `entries[]`)

`id` (`kys-s001`), `tokens[]` (the word-bank pieces in correct order), `text` (tokens joined with spaces, punctuation allowed), `gloss`, `uses[]` (lexicon ids it contains, where they exist), `sources`, `constructed`, `status`.

## Course (course.json)

`units[]` → `{ id, title: {en, ms}, taglineEntries: [entry ids], lessons[] }`, and each lesson is `{ id, title: {en, ms}, introduce: [entry ids], sentences: [sentence ids] }`.

- A lesson introduces 4–7 new entries. Review items are chosen at runtime by the scheduler, not listed.
- An entry is introduced in exactly one lesson.

## Answer matching (language.json → `orthography.normalization`)

The engine compares the learner's answer with `form` and every `variants[].form`:

- **exact**: equal after lowercasing, unifying apostrophe characters, stripping diacritics if `stripDiacritics` is set, and removing the listed punctuation
- **close**: equal once the `ignoreInLooseMatch` characters (e.g. the glottal stop `'`) are also removed. Counts as correct, and the learner sees a spelling nudge showing the full form.
- **wrong**: anything else

## Seed content provenance

The Kayan seed (`kys`) was compiled from the sources listed in `content/SOURCES.md`: 210 entries, 14 sentences, 11 units and 40 lessons. **Everything starts as `draft`.**

- `dialect` was assigned from the sources: 27 `baram`, 35 `belaga` (mostly from the ABVD Uma Juman list), and 148 `general` (found in both dialects' sources, or in sources that don't state a dialect). Speakers should confirm or correct each one.
- One phrase ("Hi aran ka'?") and 9 of the 14 sentences are `constructed: true`, meaning they were assembled from dictionary words.
- `legacy-id-map.json` maps the ids used by the earlier single-file trainer to these entry ids, so old backups can be imported.

Use `speaker-kit/verification-sheet.csv` (pre-filled with all 224 items) to check them with speakers.
