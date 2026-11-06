# Dahun

**Learn Kenyah, and later other Borneo languages, five minutes a day.**
Offline-first, free, and built with the speakers who own the language.

> *Dahun* is a working title, to be decided with Kenyah speakers. The project started with a Kayan word list, and the name comes from it.

**Status:** in development (Phase 1, MVP). Working today: the app shell in Bahasa Malaysia and English, automatic checks on all language content, and a searchable word list. Lessons come next.
**Kenyah content (Badeng variety):** the course is set up, but has **no words yet**. The first words come from Badeng speakers, starting with the builder, and a release build shows only words that two speakers have checked. Progress: [docs/PROGRESS.md](docs/PROGRESS.md).
**Demo:** _link added after prompt 09_

## Why

Kenyah is a family of closely related varieties spoken in Sarawak and Kalimantan. Many young Kenyah, especially in towns, grow up without it, and no learning app covers it. Dahun aims to:

- teach real, speaker-checked Kenyah with recorded audio, starting with the Badeng variety
- add other Kenyah varieties side by side as their speakers join, without declaring one "correct"
- work on a cheap Android phone with no signal
- be kind to learners, with short sessions and no punishment for missing days
- add other Borneo languages as community partners join

## Features (MVP, being built)

- Units and lessons on a learning path, plus 2/5/10-minute review rounds
- Exercises: pick the meaning, pick the word, match pairs, type it, build the sentence, listen and pick
- Spaced repetition, beads for progress, and a practice-days view instead of a fragile streak
- Bahasa Malaysia and English interface
- Installable PWA, works fully offline, with progress backup and restore

## Run it

```
npm install
npm run dev               # http://localhost:5173 (includes draft content, with badges)
npm run validate:content  # checks every language pack
npm run build             # release build: speaker-verified content only
npm run build:draft       # labelled preview with unverified (draft) content
npm run e2e               # end-to-end tests, on a placeholder test course
```

## Content and community

Language content lives in [`content/`](content/). Every entry records its sources, its dialect and a status (`draft` → `speaker-checked` → `verified`). Only verified content ships in release builds.

**Are you a Kenyah speaker, of Badeng or another variety?** You can help add and check words and record audio, credited as you choose. See [`speaker-kit/`](speaker-kit/) or open an issue.

How we handle consent, credit and data: [docs/ETHICS_AND_DATA.md](docs/ETHICS_AND_DATA.md).

**Kayan:** the project began with a draft Kayan word list. Because the builder is a Kenyah speaker, the course moved to Kenyah ([decision D016](docs/DECISIONS.md)). The Kayan seed is kept in the git tag `kayan-seed-v1`, ready for a Kayan community partner who wants to lead a Kayan course.

## Built with

React, TypeScript and Vite, with Node.js scripts that check and package the language content. On-device storage (Dexie) and offline support (Workbox) come in later prompts.

Developed by a solo builder with Claude Code, using the phased prompts in [`prompts/`](prompts/). AI writes code and English/Malay interface text only. **No Kenyah text is written by AI**: every word comes from speakers (or written sources listed in [content/SOURCES.md](content/SOURCES.md)) and is checked by speakers before release.

Part of the Rakyat Builders Hub (Rakyat Digital, Malaysia).

## Licences

- Code: [MIT](LICENSE)
- Language content and audio: **not** open-licensed. See [content/LICENSE-CONTENT.md](content/LICENSE-CONTENT.md)

## Credits

Speakers and sources are listed in [content/SOURCES.md](content/SOURCES.md) and on the app's Credits screen.
