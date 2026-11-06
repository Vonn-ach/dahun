# Progress log

Claude Code updates this at the end of every session (`/session-wrap`). Read it at the start of every session.

## Now

- Phase: 1 (MVP build)
- **The first course is now Kenyah (Badeng variety), ISO code `xkl`** (D016, 2026-11-06). The owner is a Badeng speaker. The Kayan seed was removed from the app and kept in the git tag `kayan-seed-v1`.
- Prompts 01 (scaffold) and 02 (content pipeline) are done and work for any pack. The `xkl` pack exists but has **no words yet**, so the app shows "Being prepared" on the learning path and Words screens.
- Locally, all of these pass: `validate:content` (0 errors, 0 warnings), lint, typecheck, unit tests (133), e2e (8, now on the fixture course), `build` and `build:draft`.
- Repo: https://github.com/Vonn-ach/dahun (public).

## Next up

1. **Write your first Badeng words** (owner, no code): 100–200 everyday words and short phrases in a copy of `speaker-kit/new-words-template.csv` saved in the git-ignored `private/` folder (column guide in `speaker-kit/README.md`), using the 11 unit themes. Also fill in your own consent form (with a speaker code and your credit choice) and keep it private. Tell Claude whether the glottal stop is written **k** or **q**.
2. **Import the sheet** (a short Claude session): write `scripts/import-csv.ts` (as planned in prompt 14, step 2). It turns the CSV into `lexicon.json` entries (`xkl-0001`…, status `draft`, a source key made from your speaker code), and groups them into lessons of 4–7 in `course.json`. It must refuse empty forms and never change a form (whitespace trim only). Defaults: `dialect: badeng`, `status: draft`, `constructed` from its column. `other_badeng_spellings` become Badeng variants, and the importer never guesses another variety.
3. Then **prompt 03 (lesson player)** in a fresh session, and **book a second Badeng speaker** to check the list (`speaker-kit/SESSION_GUIDE.md`).

## Windows notes

- If PowerShell says "running scripts is disabled", either use `npm.cmd …` or run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once. The owner did the second on 2026-11-05.
- **Testing on a phone:** run `npm run dev -- --host` (plain `npm run dev` is laptop-only), then open `http://<laptop IP>:5173` on the same Wi-Fi. This needs two Windows settings: the Wi-Fi set to a Private network, and the "Node.js JavaScript Runtime" firewall rule allowed on Private. Both were set up on 2026-11-05, and the scaffold loaded on the owner's phone.

## Notes from the switch to Kenyah (D016)

- **Dialects:** Badeng is the main and default dialect (`badeng`). Other Kenyah varieties (Lepo' Tau, Lepo' Ke', Bakung and others) share ISO code `xkl`. Each one is added to `language.json → dialects[]` when a speaker of that variety joins. Their forms go into `variants[]` and are shown as "<variety>: …" (D009), never as corrections of Badeng. If varieties turn out too different for one course, splitting them needs a small code change, because packs are keyed by ISO code.
- **Speakers:** the owner counts as a speaker, with their own code, consent form and credit choice. The code isn't linked to the owner's name in the repo unless the owner chooses name credit. `verified` still needs a second, different speaker (D008), ideally a Badeng speaker from another family or village.
- **Spelling:** the glottal stop is written as a letter, so `xkl` has no `ignoreInLooseMatch` rule. Typed answers must match a form or variant, apart from case, apostrophe look-alikes and the listed punctuation.
- **Tests no longer use real content:** `npm run e2e` starts `npm run dev:e2e`, which builds the placeholder `tst` course from `tests/fixtures/packs/valid` on port **5174**. After e2e, `src/generated/` holds that fixture bundle until the next `dev`, `build`, `lint`, `typecheck` or `test`. The build guard refuses any build from that fixture bundle, even `vite build --mode draft` (meta.json records which content folder a bundle came from).
- **Lint guard:** golden rule 5 now reads the pack codes from `content/languages/`, so `'xkl'` (and any future pack code) is rejected as a literal in `src/`.
- **Dropped:** importing backups from the old Kayan trainer (D010). The Kayan-only Hub cover image was also deleted.
- **App name:** "Dahun" is a working title (it's a Kayan word). Decide the name with Kenyah speakers. Renaming touches the repo name, the app title, the Hub listing and the cover.

## Notes from prompt 02 (content pipeline)

- **Commands:**
  - `npm run validate:content`: the full report. Add `--json` for machine-readable output.
  - `npm run build`: the release build (verified only).
  - `npm run build:draft`: everything except retired, with the Preview banner and noindex.
  - Beta build (verified + speaker-checked), in PowerShell: `$env:RELEASE_ALLOW_SPEAKER_CHECKED=1; npm run build`, then `Remove-Item Env:RELEASE_ALLOW_SPEAKER_CHECKED`.
  - `npm run sheet`: regenerates `speaker-kit/verification-sheet.csv` from the content.
  - `npm run gen:types`: run after changing a schema. A test fails if you forget.
- **Build guard:** a bare `vite build` stops unless `src/generated/` holds a release bundle. A draft bundle needs `--mode draft` (which `npm run build:draft` adds), and a beta bundle needs `RELEASE_ALLOW_SPEAKER_CHECKED=1`. Always build through the npm scripts, including on the host in prompt 09.
- **`src/generated/` isn't committed.** `dev`, `build`, `build:draft`, `lint`, `typecheck` and `test` rebuild it first. `dev` uses the draft bundle (golden rule 4 allows drafts in dev builds). If you edit content while `npm run dev` is running, restart it to see the change.
- **Lessons with fewer than 3 included entries are dropped in every build**, including draft builds (D012).
- **The dialect badge** shows only for dialects a learner can choose (`selectable`).
- **Loose-form collisions (D015):** the validator warns when two entries are equal at the "close" level, or share a written form. Prompt 03 decides how the lesson player handles such pairs.
- **New dev tools** (nothing ships to learners): Ajv + ajv-formats (schema checks), tsx (runs the TypeScript scripts), json-schema-to-typescript (types from the schemas). npm prints an "install scripts not yet covered by allowScripts" note for esbuild (it comes in with tsx). tsx works without that script, so you can ignore the note.
- **Zustand was not needed yet.** The word filters are local to the Words screen, and the current course is simply the first language in the build until settings (prompt 05) and the course picker (prompt 14).
- **Browser pane:** `.claude/launch.json` has `dev` and `preview` servers, so Claude can open the app in the desktop app's browser pane.

## Notes from prompt 01 (scaffold)

- **Versions:** React 19.3, Vite 8.3, React Router 8.5, Vitest 5.1, Playwright 1.64. Two pins:
  - **TypeScript 6.0.3, not 7.0.** typescript-eslint supports TypeScript below 6.1 only. Move to 7 when it does.
  - **ESLint 9.39, not 10.** eslint-plugin-jsx-a11y (last release 2024) doesn't list ESLint 10 support. npm marks ESLint 9 as no longer supported. It's a dev tool only, so nothing ships to learners, but revisit when jsx-a11y updates.
- **npm audit:** 7 moderate warnings, all in dev tooling (minimatch inside typescript-eslint). None of it ships in the app.
- **Not installed yet:** Zustand, Dexie and vite-plugin-pwa. Each gets added by the prompt that first uses it (Zustand turned out not to be needed in 02).
- **Lint guards:** literal text inside JSX is an error (use `useT()`), and so is any pack code as a literal in `src/` (golden rule 5).
- **Tokens:** `src/styles/tokens.test.ts` fails if a colour pair drops below WCAG AA, or if the two copies of the dark theme drift apart.
- **e2e** runs against the Vite dev server (since D016, on the fixture course), so it needs no build first. Prompt 07 (offline) should switch it to `vite preview` of a real build.
- **Line endings:** `.gitattributes` sets LF. Your Windows working copy switches from CRLF to LF as files are touched.

## Blockers / questions for the owner

- **Glottal stop: k or q?** You said it's written as a letter. Which one, or both? It goes into `language.json → orthography.notes` and the docs.
- **Rakyat Builders Hub listing:** the drafted text and cover were about Kayan, and the cover is deleted. If you submitted the listing, edit it to say Kenyah (Badeng). Ask Claude to redraft the text. A new cover makes sense once there are some Badeng words to show.
- **Malay UI strings:** `src/i18n/ms.json` was written by Claude. Please read it through, or ask a fluent Malay speaker to (UI text only, no Kenyah).
- **Consent form, before the first speaker session:** section 4 (personal data notice) is drafted.
  - Fill in its blanks: contact details, who else sees the data, where it's stored, how long it's kept, and the JPDP's contact.
  - Have someone with legal knowledge review it. The questions are in `speaker-kit/README.md`.
  - Have a fluent Malay speaker read the BM text.
- **Before the first entry becomes `verified`: what does a speaker's review cover?** Today `review[].form` records only the main form, but a verified entry also ships its variants and notes. Adding or changing a variant or note later doesn't send the entry back for checking. With several Kenyah varieties, variants will matter a lot. Options:
  1. Each review records the variants and note it saw (a snapshot), and the validator checks they still match.
  2. Release and beta builds leave out variants and notes until those have their own review.

  This is your call. It needs a schema change (D-entry), best decided before prompt 10 (speaker review tool) or the first verification session.
- **Prompt 12 vs the AI rule:** prompt 12's `sentence-candidates` task has AI propose sentence orderings, while ETHICS §5 now says AI never suggests words. Either drop that task, or state in ETHICS §5 that AI may only reorder verified tokens for speaker review. Your call, before prompt 12.
- **Consent form, withdrawal of given words:** the draft says words a speaker gave are removed if they withdraw, unless another speaker gave or confirmed them separately. Check that this is the rule you want.
- **"Report a problem" fallback (before prompt 09):** most learners and elders won't have a GitHub account. Choose an email address or another simple channel.
- **Docs to bring in line with the decisions** when the related prompt runs: the type-word rule and lesson length in `docs/PEDAGOGY.md` (D011, prompt 03).

## Questions for speakers

Only speakers can answer these. Claude must not guess. Corrections go into `content/languages/xkl/proposals/`, never straight into the lexicon.

- **Spelling conventions for Badeng:** how is the glottal stop written (k or q), and are there letters or accents that speakers write differently? Record the agreed conventions in `language.json → orthography.notes`.
- **Variety names:** how should the course name the varieties in English and Malay (for example "Badeng Kenyah" / "Kenyah Badeng")?
- **Other varieties:** which Kenyah varieties do you want next, and who could speak for them?
- **The app's name:** is a Kenyah name better than "Dahun" (a Kayan word)? Speakers give the word; Claude never suggests one.
- **Cultural content:** which customs, songs or stories are fine for a public app, and which should stay out (ETHICS §1)?

## Content status

| Language | Entries | Verified | With audio | Speakers credited |
|---|---|---|---|---|
| xkl (Kenyah, Badeng) | 0 | 0 | 0 | 0 |

The earlier Kayan seed (`kys`: 210 draft entries, 14 sentences, 0 verified) is kept in the git tag `kayan-seed-v1`. Its validation notes and speaker questions are in the version of this file at that tag.

## Session log

<!-- newest first: date · prompt · what changed · commit -->
- 2026-11-06 · switch to Kenyah · Owner decision D016: the first course is Kenyah (Badeng, `xkl`). Removed the Kayan pack (tag `kayan-seed-v1`). Added an empty `xkl` pack and a new-words template. Moved e2e onto the fixture course. The lint guard now reads pack codes from the content folder. Added the "Being prepared" state. Overhauled the docs, prompts 03–14 and the speaker kit. Fixed the content-guardian findings (build guard refuses fixture bundles, no speaker code tied to a name, consent form covers giving words, spelling notes limited to what the owner said) · 159b31d, be07985, be11d0d
- 2026-11-06 · showcase · The repo was private for a short time and is public again. CI is green for every push up to `2443e5c`. The README status was brought up to date for the Rakyat Builders Hub listing, and the Hub form answers were drafted in chat (about Kayan; now out of date).
- 2026-11-06 · speaker kit · Drafted the personal data notice (section 4) in the consent form, in BM and EN, plus a consent tick for it, and listed the points for a legal review in `speaker-kit/README.md`. Not yet reviewed.
- 2026-11-06 · 02 content pipeline · D013 schema changes and the legacy-id-map schema; owner decision D015 (é is "close" in Kayan); validator (Ajv + cross-reference and quality checks); status-filtered bundles with typed loaders (D012); `src/content` hooks; Words screen with search, unit chips and badges; "Being checked by speakers" state; Preview/Beta banner and noindex (D007); generated verification sheet; build guard against a bare `vite build` (from the content-guardian audit) · 4c70172, eae153e, 203bf9e, 8560018, b794643
- 2026-11-05 · 01 scaffold · Vite + React + TS app with all 7 routes and placeholder screens, responsive nav (bottom bar on phones, top bar on desktop), design tokens (light/dark + `data-theme`), self-hosted fonts, UI kit (Button, Card, Chip, Badge, ProgressBeads), i18n (en/ms + `useT()`), ESLint/Prettier/Vitest/Playwright, CI workflow; CLAUDE.md layout (D014) and golden rule 4 (D007) updated · d1f059b (CI green on GitHub)
- 2026-11-05 · setup · Pushed to github.com/Vonn-ach/dahun. The first three commits were re-signed with the GitHub noreply address before the first push, so their hashes changed.
- 2026-11-05 · setup · Node.js 26.13.0 LTS installed with winget. fnm (Fast Node Manager) was already installed but held no Node versions; it is still there and doesn't interfere.
- 2026-11-05 · 00 kickoff · Read all docs, schemas and the Kayan seed; reported 31 issues; recorded decisions D007–D014 and the speaker questions; initialised the git repo · fb89b6b
- 2026-11-05 · kit · Starter kit added (docs, prompts, schemas, Kayan seed, speaker kit) · cff0437
