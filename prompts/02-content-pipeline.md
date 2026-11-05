# Prompt 02: Content pipeline

```
READ FIRST: CLAUDE.md (golden rules), docs/CONTENT_MODEL.md, schemas/*.json, content/languages/kys/*.json, docs/PROGRESS.md.

GOAL: Content files are validated, filtered by status and turned into a typed, compact bundle that the app loads. Adding a language folder "just works".

BUILD:
1. scripts/validate-content.ts (run with tsx):
   - Discover every folder under content/languages/.
   - Validate each file against its schema with Ajv (allErrors, formats).
   - Cross-reference checks: unique entry and sentence ids; every id referenced in course.json and uiPhrases exists; each entry is introduced in exactly one lesson (warn if it's in none); sentence `text` equals its tokens joined with spaces (ignoring final punctuation); audio files referenced in entries exist; dialect values exist in language.json; source keys exist in lexicon.sources.
   - Content-quality warnings: two entries in the same unit with identical English glosses (bad distractors); a lesson with fewer than 3 or more than 8 introduced entries; constructed entries.
   - Output: a readable report grouped by file, with an exit code of 1 on errors (warnings don't fail).
2. scripts/build-content.ts:
   - `--include-drafts` includes draft entries. By default, only `verified` entries are included (and `speaker-checked` if `RELEASE_ALLOW_SPEAKER_CHECKED=1`).
   - Lessons whose introduced entries are all filtered out are dropped. Units with no lessons are dropped.
   - Emits src/generated/<iso>.bundle.json (minified) plus src/generated/index.ts, which exports the languages list and typed loaders (dynamic import per language for code splitting).
   - src/generated/ is git-ignored and built by predev/prebuild hooks.
3. src/content/: types generated from the schemas (json-schema-to-typescript, or hand-written and kept in sync by a test), plus useCourse(lang), getEntry(id), getUnit(id) and getLesson(id).
4. Wire the scripts: validate:content, build:draft, prebuild and predev.
5. A "Words" screen (/words) that lists the bundle's entries, with search (form, English, Malay, variants), unit filter chips, a draft badge, a dialect badge and source tags. This proves the pipeline end to end.
6. Unit tests for the validator using small fixture packs in tests/fixtures/ (valid pack, broken references, duplicate ids, missing audio).

CONSTRAINTS:
- The scripts must never modify content files.
- Do not fix or "improve" any Kayan form, even if it looks like a typo. Report it as a warning instead.

ACCEPTANCE:
- `npm run validate:content` passes on the seed, or reports only real issues, which you list for me.
- `npm run build` (release) produces an empty-but-valid Kayan bundle, because all seed entries are drafts, and the app shows a friendly "Content is being checked by speakers" state. `npm run build:draft` shows all 210 entries with draft badges.
- Copying content/languages/kys to a fake `zzz` folder with a changed name makes a second language appear in the bundle index with no code changes (test this in a fixture, not in the real content folder).

FINISH: Update docs/PROGRESS.md (include the validation summary) and commit ("feat(content): validation + typed bundles").
```
