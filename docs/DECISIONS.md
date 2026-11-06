# Decision log

Short records of choices that shape the project. Add one whenever you pick between real alternatives. Newest at the bottom.

---

### D001: PWA first, Android wrapper later
**Context:** Users are mostly on Android with patchy signal, and this is a solo builder with limited time.
**Decision:** Build a React + Vite PWA that works fully offline. Wrap it with Capacitor for Google Play in Phase 4.
**Why:** One codebase, instant web demo links for the Rakyat Builders Hub and testers, no store review in the early weeks.
**Rejected:** React Native/Expo (slower to iterate and demo on the web), Flutter (adds Dart, weaker web/PWA story).

### D002: No backend in Phase 1
**Decision:** Content ships as static JSON. Progress lives in IndexedDB, with file backup/restore.
**Why:** Zero hosting cost, no personal data, nothing to secure. Sync arrives in Phase 3 (Supabase, Singapore).

### D003: Content lives in Git, gated by status
**Decision:** `content/` is the source of truth. Release builds include only `verified` entries.
**Why:** Every change is reviewable and reversible, and errors cannot reach learners silently.

### D004: No TTS or AI-generated indigenous-language text
**Decision:** Audio comes only from recorded speakers. AI never writes target-language content.
**Why:** No reliable models exist for Kayan, and wrong forms would damage trust with the community.

### D005: Leitner scheduler behind an interface
**Decision:** Start with simple Leitner boxes. Keep `schedule()` swappable for FSRS once there is enough review data.

### D006: No punitive gamification
**Decision:** No hearts or lives, and no streak that resets. Show practice days and beads instead.
**Why:** Better retention for anxious and neurodivergent learners, and it matches the values of the project.

### D007: A labelled draft preview may be public
**Context:** Every seed entry is `draft`, so the release build has no lessons until speakers verify them. The demo, testers and the Phase 1 gate need a working app before then.
**Decision:** `main` deploys the release build (verified content only). A preview deployment of `build:draft` is allowed if it has a permanent "Preview: unverified content" banner, a draft badge on every draft entry, and `noindex` (meta tag and `X-Robots-Tag` header). The link is shared directly with testers and speakers and is not promoted as "the app". The Phase 1 gate is checked on this preview build.
**Why:** Golden rule 4 protects learners from trusting unchecked forms. A clearly labelled, unindexed preview keeps that promise while the build track moves ahead of the content track.
**Rejected:** No demo until content is verified (blocks testing for months); a password-protected preview (extra setup and friction for speakers).
**Follow-up:** Golden rule 4 in `CLAUDE.md` says drafts show "only in dev builds". Reword it to "dev builds and the labelled preview" (prompt 01).

### D008: `verified` means two speakers
**Decision:** An entry becomes `verified` only when two different speakers have said "ok" to its current form. The "one speaker plus a reliable source" path in `docs/CONTENT_MODEL.md` is dropped. A beta build for testers may include `speaker-checked` entries (`RELEASE_ALLOW_SPEAKER_CHECKED=1`) and shows a visible "beta" label.
**Why:** It matches the PRD success measure, "reliable source" was never defined, and the rule is simple enough for prompt 10 to apply automatically.
**Follow-up:** Update the status rules in `docs/CONTENT_MODEL.md` (prompt 02).

### D009: Dialect display in Phase 1
**Decision:** The main form shown is always the entry's `form`. Variants that carry a dialect are shown as a labelled line (for example "Belaga: …"), and every variant is accepted as a typed answer. The learner's dialect choice changes only the badges, which recording plays, and the onboarding question (Baram / Belaga / Not sure, which means Baram). `general` cannot be chosen as a dialect.
**Why:** The PRD (notes), the content model (variants) and the teaching design (standalone entries with a badge) each described Belaga differently. One rule is needed now. A main form that follows the dialect changes the expected answer in every exercise, and is better designed with Belaga speakers involved. The engine's `FormRef.variant` keeps that option open.
**Rejected for now:** A dialect-aware main form.

### D010: Keep the legacy trainer import, without language-specific code
**Decision:** Prompt 05 keeps importing backups from the old single-file trainer (`app: "dahun-kayan"`). The id map becomes an optional file any pack may have, `legacy-id-map.json`, with an `app` field and its own schema. The importer uses the pack whose map matches the backup's `app`. No code mentions `kys` or its folder.
**Why:** Real learners have old backups. Golden rule 5.
**Needs:** A real backup file from the owner (or the meaning and time units of `b, d, c, w, s, u`) before prompt 05.

### D011: Engine rules that settle gaps in PEDAGOGY.md
**Decision:**
- **Box movement:** only the first graded answer to an item in a session moves its Leitner box. Any wrong answer in the session sends it to box 1, due in 4 hours. Later answers in the same session count only for XP and the summary.
- **type-word:** in a lesson, after 2 correct answers to that entry in the session. In practice rounds, at box 3 or higher.
- **Lesson length:** 10–14 graded steps. Intro cards are extra, and match-pairs counts as one step. Not every entry gets every exercise type.
- **Typed answers:** whitespace is trimmed and collapsed, and only the characters in `ignorePunctuation` are removed (never a general Unicode punctuation class, which would also remove the glottal stop). If the normalised answer equals another entry's form or variant, the result is `wrong` with `confusedWith`, and the feedback shows both words.
- **Distractors:** the same `kind` is required. Then prefer the same unit and `pos`, then the same unit, then the same `pos`, then anything. Never use a distractor with the same loose form as the target, or whose gloss shares a part (split on `/ , ;`) or main word with the target's gloss.
- **XP and boxes:** combo bonus of +2 for each correct answer in a row after the first, capped at +10. Box 6 stays at 6.
- **Sentences:** sentences are progress items of their own and don't move entry boxes. build-sentence is offered only when every entry in its `uses` has been seen or is in the current lesson. Tokens are displayed exactly as in the content, including the capital on the first one.
- **listen-pick** ships with audio (prompt 06, Phase 2). The `Exercise` type includes it from the start.
**Why:** PEDAGOGY's lesson anatomy and its exercise table disagreed on when typing starts. Without the box rule, one lesson could push new words to 4-day intervals. The loose-match rule stops a different real word (such as one differing only by a glottal stop) from being marked correct.

### D012: Release builds drop content that would be left incomplete
**Decision:** `build-content` drops lessons with fewer than 3 included entries, units left with no lessons, sentences whose own status is not included, and any `uiPhrases` or `taglineEntries` that point at excluded entries. The UI then falls back to its i18n text (for example "Correct!"). The engine only receives entries that are in the bundle, so an excluded form can never appear, not even as a wrong option.
**Why:** Filtering by status can leave references dangling and lessons too small for match-pairs or distractors.

### D013: Schema and validator changes for prompt 02
These change schemas and metadata only, never language text.
- `review[]` items gain `form`: the form the speaker reviewed. A review counts towards status only while it matches the current form.
- `dialects[]` items gain `selectable` (default `true`). `defaultDialect` must be selectable. Kayan's `general` gets `selectable: false`.
- `orthography.normalization` gains an optional `looseEquivalents` map (for example `{"é": "e"}`), so a missing accent can count as "close" instead of "exact". Whether Kayan uses it is the owner's decision.
- The `audio.file` pattern accepts sentence ids and an optional take number: `^[a-z]{3}-(?:[0-9]{4}|s[0-9]{3,4})__SPK[0-9]{2,3}(_[0-9]+)?\.(m4a|mp3|ogg|webm)$`.
- `audio[]` items gain `form`: which written form the clip says (it must equal `form` or one of the variants).
- `legacy-id-map.json` gets a schema (see D010).
- The validator uses Ajv's 2020-12 build with `ajv-formats`, skips `audio/` and `proposals/` when discovering files, and also checks: the id prefix matches the pack code; no non-ASCII apostrophes in forms; a sentence identical to a lexicon phrase (warning); overlapping glosses within a unit, not only identical ones (warning).
- The speaker verification sheet is generated from the content files, with a notes column, instead of being edited by hand.

### D014: Folder names and repo hygiene
**Decision:** `src/features/review/` becomes `src/features/practice/` (route `/practice`). Add `src/features/words/` and `src/features/credits/`. Prompt 10's speaker tool lives in `src/features/speaker-review/`. `.prettierignore` covers `content/ schemas/ docs/ prompts/ speaker-kit/`, and `.gitattributes` sets `* text=auto eol=lf`.
**Why:** "Review" already means speaker verification (`review[]`, `/review`). Keeping Prettier and Windows line endings away from content and docs keeps diffs small enough to check by eye.
**Follow-up:** Update the layout in `CLAUDE.md` (prompt 01).

### D015: A missing é in Kayan is "close", not exact
**Context:** D013 added `looseEquivalents`. Kayan had `stripDiacritics: true`, so typing `e` for `é` was marked fully correct with no nudge. Only kys-0052 and kys-0053 contain `é` today (both Belaga), but the rule applies to every future entry.
**Decision (owner, 2026-11-06):** Kayan's `language.json` sets `stripDiacritics: false` and `looseEquivalents: {"é": "e"}`. A missing accent counts as correct with a spelling nudge, the same way a missing glottal stop does.
**Why:** `é` marks a different sound (open e), so learners should see it. Typing it on an Android keyboard needs a long-press, so marking it wrong would be harsh. With `stripDiacritics: true`, typing `ame` for "we" (`ame'`, kys-0038) would have been marked wrong as "father" (`amé`, kys-0053), although the learner only dropped the glottal stop.
**Rejected:** Keep stripping diacritics (no nudge, and the problem above). Strict matching (a missing accent is wrong).
**Known problem, for prompt 03 and later:** loose matching can make one typed answer fit two real words. `ame` is now "close" to both `ame'` (we) and `amé` (father), so a learner asked for "father" who types `ame` gets the nudge, and nobody can tell whether they knew the word or were thinking of "we". The same goes for any pair that differs only by `'` or `é`. Examples are `daha'`/`daha` (kys-0040/0103) and `tana`/`tana'` (kys-0113/0191). The validator lists every pair like this as a warning ("loose-form collision"), so new ones show up when content is added. Options to weigh in prompt 03: when the loose answer fits more than one entry, show both words in the nudge, and/or treat the answer as correct but not let it move the Leitner box up. Ask speakers whether learners really confuse these pairs.

### D016: The first course is Kenyah (Badeng), not Kayan
**Context:** The owner is a Kenyah speaker, not a Kayan speaker. Building a Kayan course meant depending entirely on outside speakers for every word, and raised a fair question about the owner's standing with the Kayan community. Kenyah is the owner's mother tongue. Kenyah is a cluster of varieties: Badeng, Lepo' Tau, Lepo' Ke', Bakung and others are grouped under ISO 639-3 `xkl` (Mainstream Kenyah), and a few varieties in Kalimantan have codes of their own. Sources: [SIL ISO 639-3: xkl](https://iso639-3.sil.org/code/xkl), [Ethnologue: Kenyah, Mainstream](https://www.ethnologue.com/language/xkl/), [Wikipedia: Mainstream Kenyah language](https://en.wikipedia.org/wiki/Mainstream_Kenyah_language) (which lists Badeng and Bakung among its varieties). The owner should confirm that Badeng speakers accept this grouping.
**Decision (owner, 2026-11-06):**
- The first course is Kenyah, pack `content/languages/xkl/`, ids `xkl-0001`, `xkl-s001`.
- Badeng, the owner's variety, is the main and default dialect. Other varieties are added as dialects in `language.json`, with their forms as labelled `variants[]` (D009), only when speakers of those varieties provide them. Nobody "corrects" one variety into another.
- The owner may contribute and review words as a speaker, with a speaker code, consent form and credit choice like any speaker. The code isn't tied to the owner's name anywhere in the repo unless the owner chooses to be credited by name. `verified` still needs a second, different speaker (D008), ideally a Badeng speaker from another family or village.
- The glottal stop is written with the letter `q` in the owner's spelling, so Kenyah has no apostrophe rule in `ignoreInLooseMatch`. A typed answer that leaves out a `q` is wrong, not "close" (owner, 2026-11-06): `q` stays out of `ignoreInLooseMatch`. Revisit only if the word list shows that `q` marks nothing but the glottal stop and no two words differ only by a `q`.
- The Kayan seed pack is removed from the app. The last commit with it is tagged `kayan-seed-v1`, so it can be handed to a Kayan community partner later (for example as a second course under prompt 14).
- "Dahun" stays as a working title. It is a Kayan word, so the name is to be decided with Kenyah speakers.
- D010 (importing backups from the old Kayan trainer) is dropped: those progress files can't map to Kenyah words. D015 described Kayan's settings; its general point about loose-form collisions still applies to any pack.
- Playwright tests run on the fixture course in `tests/fixtures/`, not the real content, so they don't depend on how many words a pack has.
**Rejected:**
- Keep Kayan as a second course now (it would need a course picker early, and the credibility question stays).
- One pack per Kenyah variety (packs are keyed by ISO code, and the varieties share `xkl`). Revisit only if varieties prove too different for one course with variants.
