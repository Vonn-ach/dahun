# Adding a language

A new language is a new folder plus people. If you need to change code to add one, treat that as a bug in the abstraction and fix it separately first.

## People first

1. A **partner from that community** agrees to lead content decisions (spelling, dialect, what is appropriate to teach).
2. At least two fluent speakers agree to verify and record. Use the consent form in `speaker-kit/`.
3. Agree the content licence and how people are credited. Write it into `content/languages/<iso>/README.md`.

## Files

1. Find the ISO 639-3 code (check Glottolog or Ethnologue). Use the dialect-level code if one exists.
2. Run `/new-language <iso> "<English name>" "<Malay name>"` in Claude Code. It creates the folder from the templates with empty `entries`.
3. Fill in `language.json`:
   - `dialects`, `defaultDialect`
   - `orthography.normalization`: which characters are optional when matching typed answers (glottal stop, diacritics such as é)
   - `uiPhrases`: entry ids for praise ("good!") and greetings. Leave these empty until those entries are verified.
4. Add entries to `lexicon.json` with `status: "draft"`, sources, and dialect. Use the same unit themes as Kayan, so the learning paths line up across languages.
5. Build `course.json` (`/new-lesson`) and add sentences.
6. `npm run validate:content` until it is clean.
7. Verification sessions → statuses move to `verified` → audio.
8. The language appears in the release build once it has at least one unit of verified lessons. Before that, it shows in draft builds only.

## Sarawak and Sabah languages to consider later

Iban, the Bidayuh languages, Melanau, Kenyah, Kelabit, Lun Bawang, Penan, Kadazan Dusun and others. Choose based on **who is ready to partner**, not on speaker numbers alone.
