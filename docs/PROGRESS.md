# Progress log

Claude Code updates this at the end of every session (`/session-wrap`). Read it at the start of every session.

## Now

- Phase: 0 (set up)
- Current prompt: 00 (kickoff) is done. Decisions D007–D014 are in `docs/DECISIONS.md`.
- Repo: initialised locally on `main`. Not pushed to GitHub yet.

## Next up

1. **Prompt 01 (scaffold).** First install Node.js LTS from nodejs.org, then open a new terminal and check `node -v` (about 15 minutes). In prompt 01, also:
   - rename `src/features/review/` to `src/features/practice/` and add `words/` and `credits/` (D014)
   - update `CLAUDE.md`: the folder layout (D014) and the wording of golden rule 4 (D007)
   - add `.prettierignore` and `.gitattributes` (D014)
2. Push to GitHub: create an empty public repo called `dahun`, then run `git remote add origin <repo url>` and `git push -u origin main`.
3. Book the first speaker verification session (`speaker-kit/SESSION_GUIDE.md`) and take the speaker questions below.

## Blockers / questions for the owner

- **Node.js is not installed on this PC.** This blocks prompt 01.
- **Before prompt 05:** a real backup file from the old trainer, or the meaning and time units of `b, d, c, w, s, u` (D010).
- **Southwell copyright check:** sentence `kys-s005` is sourced only to `southwell-1980` and is not marked as constructed. The notes on `kys-0011`, `kys-0044` and `kys-0132` read like dictionary examples. If they were copied, take them out of the course until a speaker gives a sentence (ETHICS §3).
- **Spelling conversions:** write the full table of how the seed's spellings were converted (ABVD symbols, and `blog-baram`'s `-k` to `'`) in `content/SOURCES.md`. The ABVD note gives only ʔ → `'`.
- **"Report a problem" fallback (before prompt 09):** most learners and elders won't have a GitHub account. Choose an email address or another simple channel.
- **Docs to bring in line with the decisions** when the related prompt runs: golden rule 4 in `CLAUDE.md` (D007), the status rules in `docs/CONTENT_MODEL.md` (D008), and the type-word rule and lesson length in `docs/PEDAGOGY.md` (D011).

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
- 2026-11-05 · 00 kickoff · Read all docs, schemas and the Kayan seed; reported 31 issues; recorded decisions D007–D014 and the speaker questions; initialised the git repo · commit "docs: kickoff decisions"
- 2026-11-05 · kit · Starter kit added (docs, prompts, schemas, Kayan seed, speaker kit) · e7e6ca2
