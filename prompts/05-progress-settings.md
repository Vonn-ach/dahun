# Prompt 05: Progress, settings, backup

```
READ FIRST: CLAUDE.md, docs/PEDAGOGY.md (XP, progress, neuro-inclusive design), src/storage/, docs/PROGRESS.md.

GOAL: Learners can see their progress in a way that motivates without guilt, adjust the app to how they learn, and never lose their progress.

BUILD:
1. XP rules from PEDAGOGY.md in src/engine/xp.ts (tested).
2. /progress: stat tiles (words started, known, long-term, XP), a 5-week practice calendar (intensity by answers), "practised X of the last 7 days", per-unit bead rows, and a "Survival goal" bar (known entries ÷ entries in Units 1–6).
3. /settings:
   - Interface language (English / Bahasa Malaysia)
   - Dialect preference (from language.json dialects; default = defaultDialect)
   - Round length default (2/5/10), Malay/English hint under prompts, sound effects (default OFF), calm mode (no motion, no auto-advance, no sound), larger text, theme (system/light/dark)
   - All settings apply immediately and persist.
4. Backup & restore (src/features/progress/backup.ts):
   - Export: download dahun-backup-YYYY-MM-DD.json containing {app:"dahun", v:1, exportedAt, courses:{[iso]:{items, days, xp}}, settings}.
   - Import: from a file or pasted text. **Also accept the legacy trainer format** {app:"dahun-kayan", v:1, state:{items:{"<unitId>:<slug>":{b,d,c,w,s,u}}, days, xp, settings}}, mapping legacy ids to entry ids through content/languages/kys/legacy-id-map.json. Merge per item, keeping the record with the newer `u`/updatedAt. Days are merged with max, XP with max.
   - Copy-to-clipboard fallback for the export.
   - Tests: round trip, merge rules, legacy import (fixture from the map).
5. Reset progress with a two-step confirm inside the page (no window.confirm).
6. /credits: speakers (from language.json credits, honouring credit preferences), sources from lexicon.sources with links, and licences.

CONSTRAINTS:
- No streak counter that resets, and no guilt copy ("You lost your streak!"). See D006.

ACCEPTANCE:
- Export → reset → import restores everything. Importing a legacy trainer backup maps all 210 seed ids.
- Settings persist across reloads, and calm mode removes every animation (verify with prefers-reduced-motion off).

FINISH: Update docs/PROGRESS.md and commit ("feat: progress, settings, backup").
```
