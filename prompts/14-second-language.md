# Prompt 14: Add a second language (Phase 5)

Run this only when the Phase 5 start conditions in `docs/ROADMAP.md` are met and a partner from that community has agreed to lead the content.

```
READ FIRST: CLAUDE.md, docs/ADDING_A_LANGUAGE.md, docs/CONTENT_MODEL.md, content/languages/xkl/language.json (as the reference), docs/PROGRESS.md.

GOAL: The app offers a second course (<LANGUAGE NAME>, ISO <code>) alongside Kenyah, with a course picker, and needs no language-specific code.

INPUTS I WILL PROVIDE: the ISO code, names in EN/MS, the dialects, the orthography rules (which characters are optional when matching typed answers), and a CSV of draft entries (form, en, ms, unit, dialect, source) from our partner.

BUILD:
1. /new-language <code> "<English>" "<Malay>", then fill language.json with what I've provided. Don't guess orthography rules. Ask me.
2. scripts/import-csv.ts: CSV → lexicon.json entries (ids <code>-0001…, status draft, sources from a column). It must refuse rows with an empty form and never alter forms (trim whitespace only).
3. course.json: group entries into the same unit themes as Kenyah (greetings, numbers, people, food, time, body, nature, describing, actions, questions, culture), with lessons of 4–7 entries. Propose the grouping to me before writing it.
4. Course picker: on first run, and in settings ("Learn: Kenyah · <New language>"). Progress, XP and calendar are per course. Settings are global.
5. Make sure nothing in src/ references a pack code (e.g. "xkl") except as test data. The lint rule already rejects pack codes as literals. If you find language-specific code, refactor it into language.json first (as a separate commit).
6. Credits screen per course.

ACCEPTANCE:
- validate:content passes for both languages. A draft build shows both courses, with separate progress for each.
- `grep -R "xkl" src/` (and the new code) finds only tests and fixtures.

FINISH: Update docs/PROGRESS.md (content status table: add a row) and commit ("feat: <code> course pack").
```
