# Prompt 00: Kickoff (no code)

```
You are joining the Dahun project: a Duolingo-style, offline-first app for learning Kayan, designed to add other Borneo languages later.

READ FIRST, in this order:
CLAUDE.md, docs/PRD.md, docs/ARCHITECTURE.md, docs/PEDAGOGY.md, docs/CONTENT_MODEL.md, docs/ETHICS_AND_DATA.md, docs/ROADMAP.md, docs/DECISIONS.md, docs/PROGRESS.md, then skim schemas/ and content/languages/kys/.

GOAL: Confirm that you understand the project and that the plan is buildable. Do not write application code in this session.

DO:
1. Summarise the product, the golden rules and the Phase 1 scope in at most 12 bullet points, so I can check you've understood.
2. List contradictions, gaps or risky assumptions you see across the docs, schemas and seed content. For each, give a recommended resolution.
3. Check the seed content against the schemas by reading it (don't write a script yet). Note anything that will fail validation or confuse the engine (e.g. duplicate glosses that would make bad distractors).
4. Propose the exact folder tree and package.json scripts you will create in prompt 01, and the main TypeScript types for the engine (Exercise, Result, ItemProgress, LessonPlan). Types only, no implementation.
5. Ask me up to 5 questions whose answers would change the plan. Group them, and suggest a default answer for each.

CONSTRAINTS:
- Do not edit any file except docs/PROGRESS.md and docs/DECISIONS.md.
- Never propose AI-generated or "corrected" Kayan text.

FINISH:
- After I answer, record the decisions in docs/DECISIONS.md, update docs/PROGRESS.md ("Next up: prompt 01"), and commit with the message "docs: kickoff decisions".
```
