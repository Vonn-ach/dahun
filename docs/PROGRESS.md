# Progress log

Claude Code updates this at the end of every session (`/session-wrap`). Read it at the start of every session.

## Now

- Phase: 1 (MVP build)
- Current prompt: 02 (content pipeline) is done. Content is validated, filtered by status and loaded as typed bundles. The Words screen lists the bundle, and the release build shows "Being checked by speakers" because nothing is verified yet. Locally, all of these pass: `validate:content` (0 errors, 16 warnings), lint, typecheck, unit tests (130), e2e (8 on Pixel 360×800 + Desktop), `build` and `build:draft`. The content-guardian audit found nothing blocking. It raised two warnings: one is fixed (`b794643`), and the other is a question for you (see Blockers).
- Repo: https://github.com/Vonn-ach/dahun (public). Pushed up to the scaffold (`d1f059b`, CI green). **Not pushed yet:** 2 docs commits from 2026-11-05 and the 4 prompt 02 commits plus this log update.

## Next up

1. **Push** the local commits, then check that CI is green on GitHub (CI now also runs the content scripts' tests). About 5 minutes.
2. Decide the open question about what a speaker review covers (see Blockers). Then run **prompt 03 (lesson player)** in a fresh session. It can reuse `src/engine/normalize.ts` for answer checking. It must also decide how to handle the D015 problem: a typed answer can be "close" to two real words.
3. Book the first speaker verification session (`speaker-kit/SESSION_GUIDE.md`). Use the regenerated `verification-sheet.csv`, which now has the notes, and take the speaker questions below.

## Windows notes

- If PowerShell says "running scripts is disabled", either use `npm.cmd …` or run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once. The owner did the second on 2026-11-05.
- **Testing on a phone:** run `npm run dev -- --host` (plain `npm run dev` is laptop-only), then open `http://<laptop IP>:5173` on the same Wi-Fi. This needs two Windows settings: the Wi-Fi set to a Private network, and the "Node.js JavaScript Runtime" firewall rule allowed on Private. Both were set up on 2026-11-05, and the scaffold loaded on the owner's phone.

## Notes from prompt 02 (content pipeline)

- **Decision D015 (owner):** a missing é in Kayan counts as "close" (correct, with a spelling nudge), not as exact. The known problem is recorded in D015 for prompt 03: `ame` is now "close" to both `ame'` (we) and `amé` (father). The validator lists every pair like this.
- **Commands:**
  - `npm run validate:content`: the full report. Add `--json` for machine-readable output.
  - `npm run build`: the release build (verified only).
  - `npm run build:draft`: everything except retired, with the Preview banner and noindex.
  - Beta build (verified + speaker-checked), in PowerShell: `$env:RELEASE_ALLOW_SPEAKER_CHECKED=1; npm run build`, then `Remove-Item Env:RELEASE_ALLOW_SPEAKER_CHECKED`.
  - `npm run sheet`: regenerates `speaker-kit/verification-sheet.csv` from the content.
  - `npm run gen:types`: run after changing a schema. A test fails if you forget.
- **Build guard:** a bare `vite build` stops unless `src/generated/` holds a release bundle. A draft bundle needs `--mode draft` (which `npm run build:draft` adds), and a beta bundle needs `RELEASE_ALLOW_SPEAKER_CHECKED=1`. Always build through the npm scripts, including on the host in prompt 09.
- **`src/generated/` isn't committed.** `dev`, `build`, `build:draft`, `lint`, `typecheck` and `test` rebuild it first. `dev` uses the draft bundle (golden rule 4 allows drafts in dev builds). If you edit content while `npm run dev` is running, restart it to see the change.
- **Lessons with fewer than 3 included entries are dropped in every build**, including draft builds (D012). Today every Kayan lesson has 4–6 entries, so the draft build has all 40 lessons.
- **The dialect badge** shows only for dialects a learner can choose (`selectable`). The 148 `general` entries get no badge.
- **New dev tools** (nothing ships to learners): Ajv + ajv-formats (schema checks), tsx (runs the TypeScript scripts), json-schema-to-typescript (types from the schemas). npm prints an "install scripts not yet covered by allowScripts" note for esbuild (it comes in with tsx). tsx works without that script, so you can ignore the note.
- **Zustand was not needed yet.** The word filters are local to the Words screen, and the current course is simply the first language in the build until settings (prompt 05) and the course picker (prompt 14).
- **Browser pane:** `.claude/launch.json` has `dev` and `preview` servers, so Claude can open the app in the desktop app's browser pane.

### Validation of the Kayan seed (0 errors, 16 warnings)

These are real things to look at. Nothing was changed. Kayan forms are for speakers to confirm.

- **kys-0012's form contains "…"** (a fill-in "My name is …" pattern). A typing exercise would ask learners to type the "…". Owner: keep it out of typing exercises (prompt 03), or ask a speaker for a full example.
- **Constructed items need a speaker before release:** entry kys-0013, and sentences kys-s006 to s014.
- **Sentences identical to lexicon phrases:** s001 = 0018, s002 = 0017, s003 = 0008, s004 = 0015 (D011 already plans for this).
- **Loose-form collisions (D015):** `ame'`/`amé` (0038/0053), `daha'`/`daha` (0040/0103), `tana`/`tana'` (0113/0191), and the same written form `duh` (0048 variant / 0162). These are the look-alike pairs already on the speaker list.
- **Overlapping English glosses within a unit:** "sorry" (0007/0008), "I" (0034/0043), "you" (0035/0039), "we" (0037/0038), "they" (0040/0041/0042). The engine's distractor rule (D011) keeps these apart. Clearer English glosses (English only, never the Kayan) would also help, e.g. "we (including you)".
- Not detectable by script: meaning-level overlaps such as foot/leg (0092/0093).

## Notes from prompt 01 (scaffold)

- **Versions:** React 19.3, Vite 8.3, React Router 8.5, Vitest 5.1, Playwright 1.64. Two pins:
  - **TypeScript 6.0.3, not 7.0.** typescript-eslint supports TypeScript below 6.1 only. Move to 7 when it does.
  - **ESLint 9.39, not 10.** eslint-plugin-jsx-a11y (last release 2024) doesn't list ESLint 10 support. npm marks ESLint 9 as no longer supported. It's a dev tool only, so nothing ships to learners, but revisit when jsx-a11y updates.
- **npm audit:** 7 moderate warnings, all in dev tooling (minimatch inside typescript-eslint). None of it ships in the app.
- **Not installed yet:** Zustand, Dexie and vite-plugin-pwa. Each gets added by the prompt that first uses it (Zustand turned out not to be needed in 02).
- **Lint guards:** literal text inside JSX is an error (use `useT()`), and so is the string `'kys'` in `src/` (golden rule 5).
- **Tokens:** `src/styles/tokens.test.ts` fails if a colour pair drops below WCAG AA, or if the two copies of the dark theme drift apart.
- **e2e** runs against the Vite dev server so it needs no build first. Prompt 07 (offline) should switch it to `vite preview` of a real build.
- **Placeholder:** the path screen linked to `/lesson/example` until real lesson ids existed. Since prompt 02 it links to the first lesson in the bundle.
- **Line endings:** `.gitattributes` sets LF. The repo was already LF, so no file content changed. Your Windows working copy switches from CRLF to LF as files are touched.

## Blockers / questions for the owner

- **Malay UI strings:** `src/i18n/ms.json` was written by Claude. Please read it through, or ask a fluent Malay speaker to (UI text only, no Kayan). Prompt 02 added the Words screen, Preview/Beta banner and "Sedang disemak oleh penutur" strings.
- **kys-0012 ("…" in the form):** keep it out of typing exercises, or get a full example from a speaker? (See the validation list above.)
- **Before the first entry becomes `verified`: what does a speaker's review cover?** Today `review[].form` records only the main form. A verified entry still ships its variants (28 entries have them) and its notes, and 62 of the 76 notes contain Kayan words. Adding or changing a variant or note later doesn't send the entry back for checking. Options:
  1. Each review records the variants and note it saw (a snapshot), and the validator checks they still match.
  2. Release and beta builds leave out variants and notes until those have their own review.
  
  This is your call. It needs a schema change (D-entry), best decided before prompt 10 (speaker review tool) or the first verification session.

- **Before prompt 05:** a real backup file from the old trainer, or the meaning and time units of `b, d, c, w, s, u` (D010).
- **Southwell copyright check:** sentence `kys-s005` is sourced only to `southwell-1980` and is not marked as constructed. The notes on `kys-0011`, `kys-0044` and `kys-0132` read like dictionary examples. If they were copied, take them out of the course until a speaker gives a sentence (ETHICS §3).
- **Spelling conversions:** write the full table of how the seed's spellings were converted (ABVD symbols, and `blog-baram`'s `-k` to `'`) in `content/SOURCES.md`. The ABVD note gives only ʔ → `'`.
- **"Report a problem" fallback (before prompt 09):** most learners and elders won't have a GitHub account. Choose an email address or another simple channel.
- **Docs to bring in line with the decisions** when the related prompt runs: the type-word rule and lesson length in `docs/PEDAGOGY.md` (D011, prompt 03). Done: golden rule 4 in `CLAUDE.md` (D007), and the status rules in `docs/CONTENT_MODEL.md` (D008, prompt 02).

## Questions for speakers (session 1)

Only speakers can answer these. Claude must not guess. Corrections go into `content/languages/kys/proposals/`, never straight into the lexicon.

- **Belaga-only entries (35).** Many are core words for a Baram-first course (he/she, we incl., you pl., mother, father, head, eye, small, night, house, "thank you", "I don't know"). Ask Baram speakers what they say. Ids: kys-0006, 0015–0018, 0036, 0037, 0039, 0046, 0047, 0052, 0053, 0072, 0082, 0084, 0094, 0096, 0097, 0099–0101, 0104–0106, 0108, 0110–0112, 0116, 0117, 0133, 0137, 0154, 0196, 0198.
- **`dahun` (kys-0198), the app's name:** is it right, and is it used in Baram as well as Belaga? Confirm early, because renaming the app later is costly.
- **Look-alike words:** confirm that each pair is two different words, as written: `daha'` they / `daha` blood (kys-0040, 0103); `tana` land / `tana'` if (kys-0113, 0191); `ame'` we / `amé` father (kys-0038, 0053). Also confirm `duh`, which appears both as the Belaga form of "woman" (kys-0048) and as "to bathe" (kys-0162).
- **UI phrases:** does "Sayu!" (kys-0130, "good") work as praise after a right answer? "Sayu kenep" (kys-0006, thank you) is a Belaga form: what do Baram speakers say?
- **Cultural content:** is it all right to teach *adet* (kys-0199) and *tekna'* (kys-0208) in a public app? (ETHICS §1. kys-0199 is also the Culture unit's tagline.)
- **Kayan text inside notes** that appears nowhere else in the content: the notes on kys-0002, 0011, 0018, 0037, 0058, 0073, 0163. They are now on the verification sheet, in the `note_in_draft` column.
- **Glottal stop or k?** In entries from `blog-baram`, is the final sound a glottal stop (`'`) or a `k`? The blog writes the glottal stop as `-k`.
- **`general` entries (148):** is each one used in both dialects, or is its dialect simply not known yet?

## Kickoff findings to act on

- The seed passes the schemas, now checked by `npm run validate:content`. The problems were in the schemas and tooling (D013, done in prompt 02), not the data.
- Engine traps are covered by D011: four look-alike word pairs, overlapping glosses in the same lesson (for example kys-0040/0041/0042, kys-0007/0008, kys-0092/0093), and four phrases repeated as sentences (kys-0008/s003, 0015/s004, 0017/s002, 0018/s001).

## Content status

| Language | Entries | Verified | With audio | Speakers credited |
|---|---|---|---|---|
| kys (Kayan, Baram) | 210 | 0 | 0 | 0 |

## Session log

<!-- newest first: date · prompt · what changed · commit -->
- 2026-11-06 · 02 content pipeline · D013 schema changes and the legacy-id-map schema; owner decision D015 (é is "close"); validator (Ajv + cross-reference and quality checks); status-filtered bundles with typed loaders (D012); `src/content` hooks; Words screen with search, unit chips and badges; "Being checked by speakers" state; Preview/Beta banner and noindex (D007); generated verification sheet; build guard against a bare `vite build` (from the content-guardian audit) · 4c70172, eae153e, 203bf9e, 8560018, b794643
- 2026-11-05 · 01 scaffold · Vite + React + TS app with all 7 routes and placeholder screens, responsive nav (bottom bar on phones, top bar on desktop), design tokens (light/dark + `data-theme`), self-hosted fonts, UI kit (Button, Card, Chip, Badge, ProgressBeads), i18n (en/ms + `useT()`), ESLint/Prettier/Vitest/Playwright, CI workflow; CLAUDE.md layout (D014) and golden rule 4 (D007) updated · d1f059b (CI green on GitHub)
- 2026-11-05 · setup · Pushed to github.com/Vonn-ach/dahun. The first three commits were re-signed with the GitHub noreply address before the first push, so their hashes changed.
- 2026-11-05 · setup · Node.js 26.13.0 LTS installed with winget. fnm (Fast Node Manager) was already installed but held no Node versions; it is still there and doesn't interfere.
- 2026-11-05 · 00 kickoff · Read all docs, schemas and the Kayan seed; reported 31 issues; recorded decisions D007–D014 and the speaker questions; initialised the git repo · fb89b6b
- 2026-11-05 · kit · Starter kit added (docs, prompts, schemas, Kayan seed, speaker kit) · cff0437
