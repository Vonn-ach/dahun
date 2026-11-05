# Progress log

Claude Code updates this at the end of every session (`/session-wrap`). Read it at the start of every session.

## Now

- Phase: 1 (MVP build)
- Current prompt: 01 (scaffold) is done. The app runs with placeholder screens for every route. Lint, typecheck, unit tests (46), e2e (Pixel 360×800 + Desktop) and the build all pass locally.
- Repo: https://github.com/Vonn-ach/dahun (public). The scaffold (`d1f059b`) is pushed and CI passed on GitHub: every step, including Playwright (run 42051982333).

## Next up

1. **Prompt 02 (content pipeline)** in a fresh session. It replaces the `validate:content` and `build:draft` stubs, and brings in Ajv. Also update the status rules in `docs/CONTENT_MODEL.md` (D008) and apply the schema changes in D013. The owner decides whether Kayan uses `looseEquivalents` (a missing é counts as "close" instead of correct).
2. Book the first speaker verification session (`speaker-kit/SESSION_GUIDE.md`) and take the speaker questions below.

## Windows notes

- If PowerShell says "running scripts is disabled", either use `npm.cmd …` or run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once. The owner did the second on 2026-11-05.
- **Testing on a phone:** run `npm run dev -- --host` (plain `npm run dev` is laptop-only), then open `http://<laptop IP>:5173` on the same Wi-Fi. This needs two Windows settings: the Wi-Fi set to a Private network, and the "Node.js JavaScript Runtime" firewall rule allowed on Private. Both were set up on 2026-11-05, and the scaffold loaded on the owner's phone.

## Notes from prompt 01 (scaffold)

- **Versions:** React 19.3, Vite 8.3, React Router 8.5, Vitest 5.1, Playwright 1.64. Two pins:
  - **TypeScript 6.0.3, not 7.0.** typescript-eslint supports TypeScript below 6.1 only. Move to 7 when it does.
  - **ESLint 9.39, not 10.** eslint-plugin-jsx-a11y (last release 2024) doesn't list ESLint 10 support. npm marks ESLint 9 as no longer supported. It's a dev tool only, so nothing ships to learners, but revisit when jsx-a11y updates.
- **npm audit:** 7 moderate warnings, all in dev tooling (minimatch inside typescript-eslint). None of it ships in the app.
- **Not installed yet:** Zustand, Dexie and vite-plugin-pwa. Each gets added by the prompt that first uses it (02/05/07).
- **Lint guards:** literal text inside JSX is an error (use `useT()`), and so is the string `'kys'` in `src/` (golden rule 5).
- **Tokens:** `src/styles/tokens.test.ts` fails if a colour pair drops below WCAG AA, or if the two copies of the dark theme drift apart.
- **e2e** runs against the Vite dev server so it needs no build first. Prompt 07 (offline) should switch it to `vite preview` of a real build.
- **Placeholder:** the path screen links to `/lesson/example` until real lesson ids exist (prompt 02).
- **Line endings:** `.gitattributes` sets LF. The repo was already LF, so no file content changed. Your Windows working copy switches from CRLF to LF as files are touched.

## Blockers / questions for the owner

- **Malay UI strings:** `src/i18n/ms.json` was written by Claude. Please read it through, or ask a fluent Malay speaker to (UI text only, no Kayan).

- **Before prompt 05:** a real backup file from the old trainer, or the meaning and time units of `b, d, c, w, s, u` (D010).
- **Southwell copyright check:** sentence `kys-s005` is sourced only to `southwell-1980` and is not marked as constructed. The notes on `kys-0011`, `kys-0044` and `kys-0132` read like dictionary examples. If they were copied, take them out of the course until a speaker gives a sentence (ETHICS §3).
- **Spelling conversions:** write the full table of how the seed's spellings were converted (ABVD symbols, and `blog-baram`'s `-k` to `'`) in `content/SOURCES.md`. The ABVD note gives only ʔ → `'`.
- **"Report a problem" fallback (before prompt 09):** most learners and elders won't have a GitHub account. Choose an email address or another simple channel.
- **Docs to bring in line with the decisions** when the related prompt runs: the status rules in `docs/CONTENT_MODEL.md` (D008, prompt 02), and the type-word rule and lesson length in `docs/PEDAGOGY.md` (D011, prompt 03). Golden rule 4 in `CLAUDE.md` (D007) is done.

## Questions for speakers (session 1)

Only speakers can answer these. Claude must not guess. Corrections go into `content/languages/kys/proposals/`, never straight into the lexicon.

- **Belaga-only entries (35).** Many are core words for a Baram-first course (he/she, we incl., you pl., mother, father, head, eye, small, night, house, "thank you", "I don't know"). Ask Baram speakers what they say. Ids: kys-0006, 0015–0018, 0036, 0037, 0039, 0046, 0047, 0052, 0053, 0072, 0082, 0084, 0094, 0096, 0097, 0099–0101, 0104–0106, 0108, 0110–0112, 0116, 0117, 0133, 0137, 0154, 0196, 0198.
- **`dahun` (kys-0198), the app's name:** is it right, and is it used in Baram as well as Belaga? Confirm early, because renaming the app later is costly.
- **Look-alike words:** confirm that each pair is two different words, as written: `daha'` they / `daha` blood (kys-0040, 0103); `tana` land / `tana'` if (kys-0113, 0191); `ame'` we / `amé` father (kys-0038, 0053). Also confirm `duh`, which appears both as the Belaga form of "woman" (kys-0048) and as "to bathe" (kys-0162).
- **UI phrases:** does "Sayu!" (kys-0130, "good") work as praise after a right answer? "Sayu kenep" (kys-0006, thank you) is a Belaga form: what do Baram speakers say?
- **Cultural content:** is it all right to teach *adet* (kys-0199) and *tekna'* (kys-0208) in a public app? (ETHICS §1. kys-0199 is also the Culture unit's tagline.)
- **Kayan text inside notes** that appears nowhere else in the content and isn't on the verification sheet: the notes on kys-0002, 0011, 0018, 0037, 0058, 0073, 0163.
- **Glottal stop or k?** In entries from `blog-baram`, is the final sound a glottal stop (`'`) or a `k`? The blog writes the glottal stop as `-k`.
- **`general` entries (148):** is each one used in both dialects, or is its dialect simply not known yet?

## Kickoff findings to act on

- The seed passes the schemas when read by eye (no script yet). The problems are in the schemas and tooling (D013), not the data.
- Engine traps are covered by D011: four look-alike word pairs, overlapping glosses in the same lesson (for example kys-0040/0041/0042, kys-0007/0008, kys-0092/0093), and four phrases repeated as sentences (kys-0008/s003, 0015/s004, 0017/s002, 0018/s001).

## Content status

| Language | Entries | Verified | With audio | Speakers credited |
|---|---|---|---|---|
| kys (Kayan, Baram) | 210 | 0 | 0 | 0 |

## Session log

<!-- newest first: date · prompt · what changed · commit -->
- 2026-11-05 · 01 scaffold · Vite + React + TS app with all 7 routes and placeholder screens, responsive nav (bottom bar on phones, top bar on desktop), design tokens (light/dark + `data-theme`), self-hosted fonts, UI kit (Button, Card, Chip, Badge, ProgressBeads), i18n (en/ms + `useT()`), ESLint/Prettier/Vitest/Playwright, CI workflow; CLAUDE.md layout (D014) and golden rule 4 (D007) updated · d1f059b (CI green on GitHub)
- 2026-11-05 · setup · Pushed to github.com/Vonn-ach/dahun. The first three commits were re-signed with the GitHub noreply address before the first push, so their hashes changed.
- 2026-11-05 · setup · Node.js 26.13.0 LTS installed with winget. fnm (Fast Node Manager) was already installed but held no Node versions; it is still there and doesn't interfere.
- 2026-11-05 · 00 kickoff · Read all docs, schemas and the Kayan seed; reported 31 issues; recorded decisions D007–D014 and the speaker questions; initialised the git repo · fb89b6b
- 2026-11-05 · kit · Starter kit added (docs, prompts, schemas, Kayan seed, speaker kit) · cff0437
