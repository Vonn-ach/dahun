# Dahun

**Learn Kayan, and later other Borneo languages, five minutes a day.**
Offline-first, free, and built with the speakers who own the language.

> *Dahun* means "language" in Kayan.

**Status:** early development (Phase 0). Kayan seed content: 210 entries, **0 verified by speakers yet**. See [docs/PROGRESS.md](docs/PROGRESS.md).
**Demo:** _link added after prompt 09_

## Why

Kayan is spoken along the Baram and Rejang rivers in Sarawak and across the border in Kalimantan. Many young Kayan, especially in towns, grow up without it, and no learning app covers it. Dahun aims to:

- teach real, speaker-checked Kayan with recorded audio
- work on a cheap Android phone with no signal
- be kind to learners, with short sessions and no punishment for missing days
- add other Borneo languages as community partners join

## Features (MVP)

- Units and lessons on a learning path, plus 2/5/10-minute review rounds
- Exercises: pick the meaning, pick the word, match pairs, type it (gentle on the glottal stop), build the sentence, listen and pick
- Spaced repetition, beads for progress, and a practice-days view instead of a fragile streak
- Bahasa Malaysia and English interface
- Installable PWA, works fully offline, with progress backup and restore

## Run it

```
npm install
npm run dev            # http://localhost:5173
npm run build:draft    # includes unverified (draft) content, with badges
```

## Content and community

Language content lives in [`content/`](content/). Every entry records its sources and a status (`draft` → `speaker-checked` → `verified`). Only verified content ships in release builds.

**Are you a Kayan speaker?** You can help check words and record audio. See [`speaker-kit/`](speaker-kit/) or open an issue.

How we handle consent, credit and data: [docs/ETHICS_AND_DATA.md](docs/ETHICS_AND_DATA.md).

## Built with

React, TypeScript, Vite, Dexie and Workbox. Developed with Claude Code using the phased prompts in [`prompts/`](prompts/). Part of the Rakyat Builders Hub (Rakyat Digital, Malaysia).

## Licences

- Code: [MIT](LICENSE)
- Language content and audio: **not** open-licensed. See [content/LICENSE-CONTENT.md](content/LICENSE-CONTENT.md)

## Credits

Speakers and sources are listed in [content/SOURCES.md](content/SOURCES.md) and on the app's Credits screen.
