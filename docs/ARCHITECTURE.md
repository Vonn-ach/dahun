# Architecture — Dahun

## Principles

- **Offline first.** After the first visit, the whole app (code, content and audio for the current course) works with no network.
- **Content is data.** Languages are folders of JSON plus audio. Adding a language means adding a folder and passing validation, not writing code.
- **Pure engine, thin UI.** Exercise generation, answer checking and scheduling are plain TypeScript functions that are easy to unit-test.
- **No server in Phase 1.** Static hosting only. A backend arrives in Phase 3, and only for features that need one (sync, contributor review).

## Phase 1 (MVP)

```
 content/languages/<iso>/*.json ──► scripts/validate-content.ts (Ajv + cross-refs)
                                └──► scripts/build-content.ts ──► src/generated/<iso>.bundle.json + types
                                                                     │
 ┌───────────────────────────── React app (Vite) ────────────────────┴──────────────┐
 │ app/ routes:  /  (path)   /lesson/:id   /practice   /words   /progress   /settings │
 │                                                                                   │
 │ features/*  ──uses──►  engine/ (pure)                   storage/ (Dexie)          │
 │                         • buildLesson(lesson, lexicon,   • progress (per item SRS) │
 │                           progress, rng) → Exercise[]    • xp, practice days       │
 │                         • checkAnswer(ex, input,         • settings                │
 │                           orthography) → Result          • backup / restore JSON   │
 │                         • schedule(item, result, now)                              │
 │                           → next review                                            │
 │ i18n/ (en, ms)   ui/ (Button, Card, ProgressBeads…)   styles/tokens.css             │
 └───────────────────────────────────────────────────────────────────────────────────┘
          │ vite-plugin-pwa (Workbox): precache app shell + content bundle; audio cached on first play
          ▼
   Static hosting (Cloudflare Pages or GitHub Pages) via GitHub Actions on push to main
```

### Key modules

| Module | Responsibility | Notes |
|---|---|---|
| `scripts/validate-content.ts` | Validates every language pack against `schemas/`. Checks that IDs are unique, every reference resolves, audio files exist, and no lesson is empty. | Runs in CI and before every build. Fails loudly. |
| `scripts/build-content.ts` | Filters by status (release = `verified`), then emits a compact bundle and TypeScript types. | `--include-drafts` flag for `build:draft`. |
| `engine/exercises/*` | One generator per exercise type. Input: target item, distractor pool, RNG. Output: a serialisable `Exercise`. | Distractors come from the same unit first, never with identical glosses. |
| `engine/answers.ts` | Normalises answers using `language.json → orthography.normalization`. Returns `exact` / `close` (e.g. a missing glottal stop) / `wrong`. | Never changes content. It only compares. |
| `engine/scheduler.ts` | Leitner boxes (1, 2, 4, 8, 16, 32 days) for Phase 1. Keep the interface swappable for FSRS later. | `now` is passed in. |
| `storage/db.ts` | Dexie schema: `progress(itemId, box, due, seen, right, wrong, updatedAt)`, `days(date, answers)`, `settings`, `meta`. | Versioned migrations from day one. |
| `features/progress/backup.ts` | Export and import progress as JSON. Import merges per item, keeping the newer copy. | Dahun's own format only. The old Kayan trainer's backup import was dropped with the Kayan pack (D016). |

### Data flow for one answer

`LessonPlayer` → `checkAnswer()` → `schedule()` → `db.progress.put()` → XP / day counters → feedback UI. All writes are local and immediate.

## Phase 3 (accounts, sync, contributors)

- **Supabase**, Singapore region (closest to Malaysia): Auth (email magic link + Google), Postgres, Storage for audio, Row Level Security.
- Tables: `profiles`, `progress_snapshots` (one JSON per user per course, merged like backup/restore), `entries` (mirror of content with review state), `reviews` (speaker verdicts), `recordings`.
- The **contributor app** (`/contribute`, role-gated) lets a speaker see an entry, mark it correct or suggest a fix, record audio with `MediaRecorder`, and submit. The owner approves, then a script exports approved changes back into `content/` as a pull request. **Git stays the source of truth for published content.**
- Optional **AI content assistant** (Supabase Edge Function calling the Claude API, with the key kept server-side). It drafts exercise variants, distractors and Malay/English explanations **only from verified entries**. Everything it produces goes into the review queue. It never writes indigenous-language text that a speaker has not approved.

## Phase 4 (Android)

Wrap the PWA with Capacitor and ship to Google Play. Bundle the content and audio in the app so the first launch works offline.

## Non-functional targets

- First load under 1.5 MB before audio. Lighthouse PWA and Accessibility scores of at least 90.
- Runs smoothly on a 3–4-year-old Android phone (test with CPU throttling).
- No third-party scripts in Phase 1.
