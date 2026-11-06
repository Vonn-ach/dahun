# Dahun

**Learn Kayan, and later other Borneo languages, five minutes a day.**
Offline-first, free, and built with the speakers who own the language.

> *Dahun* means "language" in Kayan (from a Belaga word list; speakers are still to confirm it).

**Status:** in development (Phase 1, MVP). Working today: the app shell in Bahasa Malaysia and English, automatic checks on all language content, and a searchable word list. Lessons come next.
**Kayan content:** 210 draft entries from written sources, **0 verified by speakers yet**, so a release build shows "Being checked by speakers" instead of lessons. Progress: [docs/PROGRESS.md](docs/PROGRESS.md).
**Demo:** _link added after prompt 09_

## Why

Kayan is spoken along the Baram and Rejang rivers in Sarawak and across the border in Kalimantan. Many young Kayan, especially in towns, grow up without it, and no learning app covers it. Dahun aims to:

- teach real, speaker-checked Kayan with recorded audio
- work on a cheap Android phone with no signal
- be kind to learners, with short sessions and no punishment for missing days
- add other Borneo languages as community partners join

## Features (MVP, being built)

- Units and lessons on a learning path, plus 2/5/10-minute review rounds
- Exercises: pick the meaning, pick the word, match pairs, type it (gentle on the glottal stop), build the sentence, listen and pick
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
```

## Content and community

Language content lives in [`content/`](content/). Every entry records its sources and a status (`draft` → `speaker-checked` → `verified`). Only verified content ships in release builds.

**Are you a Kayan speaker?** You can help check words and record audio. See [`speaker-kit/`](speaker-kit/) or open an issue.

How we handle consent, credit and data: [docs/ETHICS_AND_DATA.md](docs/ETHICS_AND_DATA.md).

## Built with

React, TypeScript and Vite, with Node.js scripts that check and package the language content. On-device storage (Dexie) and offline support (Workbox) come in later prompts.

Developed by a solo builder with Claude Code, using the phased prompts in [`prompts/`](prompts/). AI writes code and English/Malay interface text only. **No Kayan text is written by AI**: every word comes from the written sources in [content/SOURCES.md](content/SOURCES.md) and is checked by speakers before release.

Part of the Rakyat Builders Hub (Rakyat Digital, Malaysia).

## Licences

- Code: [MIT](LICENSE)
- Language content and audio: **not** open-licensed. See [content/LICENSE-CONTENT.md](content/LICENSE-CONTENT.md)

## Credits

Speakers and sources are listed in [content/SOURCES.md](content/SOURCES.md) and on the app's Credits screen.
