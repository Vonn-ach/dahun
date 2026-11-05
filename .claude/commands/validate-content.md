---
description: Validate all language packs and explain any problems (never edits language text)
---

Run `npm run validate:content`. If the script doesn't exist yet, say so and stop.

Then:
1. Summarise the result: errors and warnings per language pack and per file.
2. For each error, explain the cause in plain words and propose a fix.
   - Structural fixes (a missing id reference, a typo in a dialect key, an empty lesson) can be applied after I say yes.
   - **Never** propose changing a `form`, `variants[].form`, sentence `tokens` or `text` in an indigenous language. If one looks wrong, list it under "Ask a speaker".
3. End with a table of entry status counts (draft / speaker-checked / verified / retired) and audio coverage for each language.
