---
description: End the session, update docs/PROGRESS.md and commit
---

Wrap up this session:

1. Run `npm run lint && npm run typecheck && npm run test` (skip any script that doesn't exist yet). If something fails, say so and ask whether to fix it now or log it as a blocker. Don't commit broken tests silently.
2. Update `docs/PROGRESS.md`:
   - **Now**: the current phase and prompt
   - **Next up**: the 1–3 smallest next steps, the first one doable in under 30 minutes
   - **Blockers / questions for the owner**
   - **Content status** table (from the content files, if they changed)
   - Add one line to the **Session log** (newest first): date · prompt · what changed · short commit hash (fill it in after committing)
3. If we made a real choice between alternatives, add an entry to `docs/DECISIONS.md`.
4. Show me `git status` and a proposed commit message in Conventional Commits style. Commit after I say yes, then ask whether to push.
5. End with a 3-line summary I could paste into a Rakyat Builders Hub progress update.
