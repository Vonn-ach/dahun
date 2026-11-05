---
description: Add a lesson to a unit using existing entries only
argument-hint: <iso> <unit-id> <entry-id> [entry-id ...]
---

Arguments: $ARGUMENTS

The first argument is the ISO code, the second the unit id, and the rest are entry ids. Add a lesson to `content/languages/<iso>/course.json`.

Rules:
- Use only entry ids that already exist in that language's `lexicon.json`. If any id is missing, stop and list it.
- Each entry may be introduced in only one lesson. If an id is already introduced elsewhere, tell me where and ask before moving it.
- A lesson introduces 4–7 entries. Warn me if it's outside that range.
- Give the lesson the next id in the unit (e.g. `greet-3`) and propose titles in English and Malay from the entries' glosses. Never put indigenous-language text in titles.
- Attach any sentences from `sentences.json` whose `uses` are all introduced in this lesson or earlier ones.
- Run `npm run validate:content` afterwards and show the new lesson JSON.
