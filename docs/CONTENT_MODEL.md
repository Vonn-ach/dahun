# Content model

All course content lives in `content/languages/<iso-639-3>/`. Schemas are in `schemas/`. `npm run validate:content` must pass before any commit that touches content.

```
content/languages/xkl/
  language.json     name, dialects, orthography and answer-matching rules, UI phrases (by entry id), credits
  lexicon.json      sources + entries (words and phrases)
  sentences.json    example and practice sentences
  course.json       units → lessons, referencing lexicon and sentence ids
  legacy-id-map.json  optional: maps an older app's item ids to entry ids, for importing old backups (D010; no pack uses it since D016)
  audio/            <entry-or-sentence-id>__<speaker-id>[_<take>].m4a (or .mp3/.ogg/.webm), 44.1 or 48 kHz mono
  proposals/        speaker corrections waiting for the owner (not read by the build)
```

`npm run validate:content` checks every pack against the schemas and cross-checks references (the full list is at the top of `scripts/lib/validate.ts`). `npm run build` and `npm run build:draft` filter the packs by status and write the bundles the app loads into `src/generated/`, which is not committed.

## Entry (lexicon.json → `entries[]`)

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Stable ID, `xkl-0001`. **Never reuse or renumber.** Learner progress is keyed on it. |
| `form` | yes | The form as written in the chosen dialect, exactly as the speaker gave it. |
| `kind` | yes | `word` or `phrase` |
| `pos` | no | `noun`, `verb`, `adjective`, `pronoun`, `number`, `question`, `particle`, `phrase`, `other` |
| `gloss.en`, `gloss.ms` | yes | Meanings in English and Malay |
| `dialect` | yes | One of the dialect ids in `language.json` (e.g. `badeng`; other Kenyah varieties are added there as their speakers join) |
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

`id` (`xkl-s001`), `tokens[]` (the word-bank pieces in correct order), `text` (tokens joined with spaces, punctuation allowed), `gloss`, `uses[]` (lexicon ids it contains, where they exist), `sources`, `constructed`, `status`.

## Course (course.json)

`units[]` → `{ id, title: {en, ms}, taglineEntries: [entry ids], lessons[] }`, and each lesson is `{ id, title: {en, ms}, introduce: [entry ids], sentences: [sentence ids] }`.

- A lesson introduces 4–7 new entries. Review items are chosen at runtime by the scheduler, not listed. The validator warns below 3 or above 8.
- An entry is introduced in exactly one lesson.

## Dialects (language.json → `dialects[]`)

Each dialect has an `id`, a `name` and optionally an ISO code. `selectable: false` marks a label a learner can't choose as their own dialect, such as a "shared / not yet checked" label. `defaultDialect` must be selectable. The UI shows a dialect badge only for selectable dialects.

## Answer matching (language.json → `orthography.normalization`)

The engine compares the learner's answer with `form` and every `variants[].form`:

- **exact**: equal after lowercasing, unifying apostrophe characters, stripping diacritics if `stripDiacritics` is set, and removing the listed punctuation
- **close**: equal once the `ignoreInLooseMatch` characters (e.g. a glottal stop written as `'`) are also removed, and each `looseEquivalents` character is replaced (e.g. `{"é": "e"}`). Counts as correct, and the learner sees a spelling nudge showing the full form.
- **wrong**: anything else

Each pack sets its own rules. Kenyah (Badeng) writes the glottal stop as a letter, so it has no `ignoreInLooseMatch` characters and no `looseEquivalents` yet: a typed answer must match a form or variant exactly, apart from case, apostrophe look-alikes and the listed punctuation (D016). Add a rule only when speakers agree that a difference is a spelling slip, not a different word. Two entries whose forms are equal at the "close" level make a typed answer ambiguous (D015); the validator lists them as warnings.

## Kenyah pack (`xkl`)

Kenyah is a family of varieties. Badeng, Lepo' Tau, Lepo' Ke', Bakung and others are grouped under ISO 639-3 `xkl` ("Mainstream Kenyah"), so they share one pack (D016).

- **Main dialect: `badeng`**, the owner's variety. Every entry's `form` is Badeng until a decision says otherwise.
- **Other varieties** are added to `language.json → dialects[]` when one of their speakers joins. Their forms go into `variants[]` with that dialect, and are shown as "<variety>: …" and accepted as typed answers (D009). An entry that exists only in another variety gets that variety as its `dialect`.
- **Sources:** the first words come from Badeng speakers, starting with the owner (`SPK01`, once their consent form is filed). Each speaker's contribution gets a source key such as `spk01-2026`. Written sources are added only after their licence is checked.
- **Status:** new entries start as `draft`. The owner's own `ok` review makes an entry `speaker-checked`. A second, different speaker makes it `verified` (D008).
- **Spelling:** the glottal stop is written as a letter, not an apostrophe. Record exactly what speakers write, and write the conventions down in `language.json → orthography.notes`.

### Earlier Kayan seed

The project began with a Kayan (`kys`) seed of 210 draft entries compiled from written sources. It was removed from the app when the course moved to Kenyah (D016), and it is kept in the git tag `kayan-seed-v1` for a future Kayan community partner.

Use `speaker-kit/verification-sheet.csv` (every entry and sentence, with their notes) to check them with speakers. `npm run sheet` makes it from the content files (D013), so run it again after the content changes.
