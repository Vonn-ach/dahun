# Content model

All course content lives in `content/languages/<iso-639-3>/`. Schemas are in `schemas/`. `npm run validate:content` must pass before any commit that touches content.

```
content/languages/kys/
  language.json     name, dialects, orthography and answer-matching rules, UI phrases (by entry id), credits
  lexicon.json      sources + entries (words and phrases)
  sentences.json    example and practice sentences
  course.json       units → lessons, referencing lexicon and sentence ids
  legacy-id-map.json  optional: maps an older app's item ids to entry ids, for importing old backups (D010)
  audio/            <entry-or-sentence-id>__<speaker-id>[_<take>].m4a (or .mp3/.ogg/.webm), 44.1 or 48 kHz mono
  proposals/        speaker corrections waiting for the owner (not read by the build)
```

`npm run validate:content` checks every pack against the schemas and cross-checks references (the full list is at the top of `scripts/lib/validate.ts`). `npm run build` and `npm run build:draft` filter the packs by status and write the bundles the app loads into `src/generated/`, which is not committed.

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
| `review[]` | no | `{ speaker, date, form, verdict: "ok" \| "fix" \| "unsure", comment }`. `form` is the form the speaker reviewed. A review counts towards the status only while it equals the current `form`. |
| `audio[]` | no | `{ file, speaker, form, dialect }`. `form` is the written form the clip says: `form` or one of the variants. |
| `malayCognate` | no | `true` if it is a recognisable cousin of a Malay word (used by the "Malay bridge" exercise) |
| `tags[]` | no | Topic tags (`greetings`, `food`…) |

### Status rules

- `draft`: from a written source or constructed. Shown only in dev builds and the labelled preview (`build:draft`, D007), with a "draft" badge.
- `speaker-checked`: one fluent speaker said "ok" to the current form (recorded in `review[]`). Included in a beta build for testers when `RELEASE_ALLOW_SPEAKER_CHECKED=1` is set, with a visible label.
- `verified`: two different speakers said "ok" to the current form (D008). **Only verified content ships in release builds.**
- `retired`: kept for ID stability, never shown, not even in draft builds.

The validator fails when a status claims more than `review[]` supports: `speaker-checked` needs one speaker, and `verified` two, whose latest review of the current form is "ok". A review of an older form doesn't count, so changing a form sends it back for checking.

Sentences follow the same rules, using their `text` as the form.

### What a release build leaves out (D012)

The build filters by status, then drops anything that would be left incomplete: lessons with fewer than 3 included entries, units with no lessons left, sentences whose own status isn't included, and `uiPhrases`, `taglineEntries` and sentence `uses` that point at excluded entries. The UI then falls back to its own i18n text. Speakers' `review[]` records never go into the bundle.

## Sentences (sentences.json → `entries[]`)

`id` (`kys-s001`), `tokens[]` (the word-bank pieces in correct order), `text` (tokens joined with spaces, punctuation allowed), `gloss`, `uses[]` (lexicon ids it contains, where they exist), `sources`, `constructed`, `status`.

## Course (course.json)

`units[]` → `{ id, title: {en, ms}, taglineEntries: [entry ids], lessons[] }`, and each lesson is `{ id, title: {en, ms}, introduce: [entry ids], sentences: [sentence ids] }`.

- A lesson introduces 4–7 new entries. Review items are chosen at runtime by the scheduler, not listed. The validator warns below 3 or above 8.
- An entry is introduced in exactly one lesson.

## Dialects (language.json → `dialects[]`)

Each dialect has an `id`, a `name` and optionally an ISO code. `selectable: false` marks a label a learner can't choose as their own dialect, such as Kayan's `general` ("shared / not yet checked"). `defaultDialect` must be selectable. The UI shows a dialect badge only for selectable dialects.

## Answer matching (language.json → `orthography.normalization`)

The engine compares the learner's answer with `form` and every `variants[].form`:

- **exact**: equal after lowercasing, unifying apostrophe characters, stripping diacritics if `stripDiacritics` is set, and removing the listed punctuation
- **close**: equal once the `ignoreInLooseMatch` characters (e.g. the glottal stop `'`) are also removed, and each `looseEquivalents` character is replaced (e.g. `{"é": "e"}`). Counts as correct, and the learner sees a spelling nudge showing the full form.
- **wrong**: anything else

Kayan uses `stripDiacritics: false` with `looseEquivalents: {"é": "e"}`, so a missing accent gets a nudge instead of counting as exact (D015). Two entries whose forms are equal at the "close" level (for example a pair that differs only by a glottal stop or an accent) make a typed answer ambiguous; the validator lists them as warnings.

## Seed content provenance

The Kayan seed (`kys`) was compiled from the sources listed in `content/SOURCES.md`: 210 entries, 14 sentences, 11 units and 40 lessons. **Everything starts as `draft`.**

- `dialect` was assigned from the sources: 27 `baram`, 35 `belaga` (mostly from the ABVD Uma Juman list), and 148 `general` (found in both dialects' sources, or in sources that don't state a dialect). Speakers should confirm or correct each one.
- One phrase ("Hi aran ka'?") and 9 of the 14 sentences are `constructed: true`, meaning they were assembled from dictionary words.
- `legacy-id-map.json` maps the ids used by the earlier single-file trainer (`app: "dahun-kayan"`) to these entry ids, so old backups can be imported.

Use `speaker-kit/verification-sheet.csv` (pre-filled with all 224 items) to check them with speakers.
