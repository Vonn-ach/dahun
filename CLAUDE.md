# CLAUDE.md — Dahun

Project memory for Claude Code. Read this first in every session, then `docs/PROGRESS.md`.

## What this is

**Dahun** (working title) is a Duolingo-style app for learning the indigenous languages of Borneo, starting with **Kenyah (Badeng variety, ISO 639-3 `xkl`)**, the owner's mother tongue (D016). It is built so that other languages and varieties (other Kenyah varieties, Kayan, Iban, Bidayuh, Kelabit, Melanau and others) can be added as **language packs** or dialects with no code changes.

- Owner: Pherry Asan Philip (solo builder, Rakyat Builders Hub, Malaysia), a Badeng Kenyah speaker
- Users: heritage learners (Kenyah who grew up without the language), other Sarawakians, teachers, the diaspora
- Product spec: `docs/PRD.md` · Architecture: `docs/ARCHITECTURE.md` · Teaching design: `docs/PEDAGOGY.md`
- Content rules: `docs/CONTENT_MODEL.md` · Ethics and data: `docs/ETHICS_AND_DATA.md` · Plan: `docs/ROADMAP.md`

## Golden rules (never break these)

1. **Never invent, "fix" or translate indigenous-language text yourself.** Your training data on Kenyah and other Borneo languages is thin and often wrong. Every indigenous-language word, phrase or sentence a learner sees must come from `content/languages/<code>/`. That holds even though the owner is a speaker: words come from the owner or other speakers in chat or in files, never from you. If something is missing, stop and say so. Add a `TODO(content)` and ask the owner. Do not fill the gap.
2. **Never change a form in a content file** unless the owner gives you the corrected form from a speaker. Keep every character exactly as written: a glottal stop written as a letter (`q` in Badeng Kenyah) stays that letter, and one written as an apostrophe is the ASCII `'` (U+0027). Do not "normalise" spelling, and never turn one variety's form into another's.
3. **No text-to-speech for indigenous languages.** Audio comes only from recorded speakers. If an entry has no audio, show no audio button.
4. **Respect content status.** Release builds include only entries with status `verified` (or `speaker-checked` when the release flag allows it). `draft` content shows only in dev builds and the labelled preview (D007), with a visible "draft" badge.
5. **Keep the code language-agnostic.** No `if (lang === 'xkl')`. Anything language-specific (orthography, answer normalisation, dialects, UI phrases such as a praise word) lives in `language.json`. The lint rule rejects the code of every pack in `content/languages/` when it appears as a string literal in `src/` (outside tests). It can't catch everything, such as template strings, so the rule still applies where lint is silent.
6. **No tracking, ads or personal data collection** in the MVP. Progress stays on the device. Anything else needs a written decision in `docs/DECISIONS.md` and the consent text in `docs/ETHICS_AND_DATA.md`.

## Stack

- Vite + React + TypeScript (strict), React Router
- Styling: CSS variables for design tokens + CSS modules (no UI kit unless a decision says so)
- State: Zustand · Storage: IndexedDB through Dexie (progress, settings, cached audio)
- Content: JSON in `content/`, validated against `schemas/` with Ajv at build time. A build step generates a typed bundle in `src/generated/`.
- PWA: `vite-plugin-pwa` (Workbox). The whole course must work offline after the first load.
- i18n: UI strings in `src/i18n/{en,ms}.json`. No hard-coded UI text.
- Tests: Vitest + Testing Library (unit and component), Playwright (end-to-end, mobile viewport)
- Lint/format: ESLint + Prettier
- Later phases: Capacitor (Android), Supabase in the Singapore region (accounts, sync, review queue)

Use current stable versions. Do not add a dependency without saying why in the commit message.

## Commands

These are defined in `package.json` by prompt 01. Keep the names stable.

```
npm run dev                # local dev server
npm run build              # production build (verified content only)
npm run build:draft        # build that includes draft content, with badges
npm run validate:content   # schema + cross-reference checks for every language pack
npm run test               # unit + component tests
npm run e2e                # Playwright end-to-end tests (on the fixture course, port 5174)
npm run lint && npm run typecheck   # lint also runs prettier --check
npm run format             # apply Prettier formatting
npm run preview            # serve the production build locally
npm run sheet              # regenerate speaker-kit/verification-sheet.csv from the content
npm run gen:types          # regenerate src/content/schema.generated.ts after a schema change
```

## Layout

```
content/languages/<iso>/   language.json, lexicon.json, sentences.json, course.json, audio/
schemas/                   JSON Schemas for every content file
scripts/                   content validation, bundle generation, audio checks
src/
  app/                     routes, layout, providers
  features/
    lesson/                lesson player + exercise components
    path/                  unit/lesson map (learning path)
    practice/              spaced-repetition practice rounds (/practice)
    words/                 word list (/words)
    progress/              XP, streaks, stats, backup/restore
    settings/
    credits/               speakers and sources (/credits)
    speaker-review/        speaker verification tool (prompt 10)
  engine/                  PURE TypeScript, no React: exercise generation, answer checking, scheduler
  content/                 loaders + typed access to the generated bundle
  storage/                 Dexie database + migrations
  i18n/  ui/  styles/
  test/                    Vitest setup and render helpers
tests/e2e/
.github/workflows/         CI: lint, typecheck, unit tests, build, Playwright
docs/                      specs, decisions, progress log
prompts/                   the phased build prompts the owner pastes in
speaker-kit/               consent form, verification sheet, recording guide (for humans)
```

## Coding rules

- `src/engine/` is pure and fully unit-tested: seeded randomness, no `Date.now()` inside logic (pass time in).
- Components stay small. Each exercise type is one component plus one generator function in the engine.
- Accessibility: every control is keyboard-reachable with a visible focus ring. Tap targets are at least 44px. Colour is never the only signal. Respect `prefers-reduced-motion`.
- Neuro-inclusive UX (see `docs/PEDAGOGY.md`): one clear main action per screen, no punishing mechanics (no hearts or lives by default, streak freezes are automatic), a calm mode, sessions of 2–5 minutes.
- Mobile first. Test at 360px wide. The main users are on Android phones with patchy signal.
- Comments explain *why*, not *what*.

## Definition of done (every task)

1. `npm run validate:content && npm run lint && npm run typecheck && npm run test` all pass.
2. New engine logic has unit tests. New screens have at least one Playwright happy path.
3. It works offline, at 360px, and with the keyboard only.
4. No golden rule is broken. When unsure, run the `content-guardian` subagent on the diff.
5. `docs/PROGRESS.md` is updated (done / next / blockers) and the work is committed with a clear message.

## How to work with the owner

- The owner is a solo builder. Explain a framework or tooling choice in a sentence or two the first time it comes up.
- For anything touching more than about 3 files, propose a plan first and wait for approval.
- Work in small, reviewable steps and commit after each green step.
- If a request conflicts with a golden rule, say so plainly and suggest the closest safe option.
- Finish every session with `/session-wrap`.
