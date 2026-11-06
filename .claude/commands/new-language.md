---
description: Scaffold a new language pack folder (no content)
argument-hint: <iso> "<English name>" "<Malay name>"
---

Create a new language pack from these arguments: $ARGUMENTS

1. Read `docs/ADDING_A_LANGUAGE.md` and use `content/languages/xkl/` as the structural reference only. Copy **no** entries from any pack.
2. Create `content/languages/<iso>/` with:
   - `language.json`: code, names, `dialects: []`, `defaultDialect: "general"`, orthography normalisation with lowercase + apostrophe unification only, `uiPhrases: {}`, `credits: {speakers: [], partner: null}`, `status: "planning"`
   - `lexicon.json`: `{ "language": "<iso>", "sources": {}, "entries": [] }`
   - `sentences.json`: `{ "language": "<iso>", "entries": [] }`
   - `course.json`: the same unit ids and titles as Kenyah (`xkl`), each with `lessons: []`
   - `README.md`: partner, licence agreement status, and dialect decisions, all marked TODO
3. Run `npm run validate:content`. An empty pack must pass; fix the validator if it doesn't.
4. List what I need to provide next (partner, dialects, orthography rules, the first entries CSV).
