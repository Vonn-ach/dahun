---
description: Run every check and give a go / no-go for pushing or releasing
---

Run these and collect results (continue even if one fails):

1. `npm run validate:content`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test`
5. `npm run e2e`
6. `npm run build`, then report the total JS/CSS size and the largest chunks
7. Search `src/` for: hard-coded UI strings outside i18n, `console.log`, `TODO` / `FIXME`, any language code used in logic (e.g. `'kys'`), `Date.now()` inside `src/engine/`
8. Use the **content-guardian** subagent on `git diff main...HEAD` (or the uncommitted diff)

Report as a table: check · pass/fail · notes. Then give a verdict:
- **GO**: everything passes
- **GO with notes**: only warnings
- **NO-GO**: list the blocking items and the smallest fix for each

Don't fix anything unless I ask.
