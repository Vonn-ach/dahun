# Prompt 12: AI content assistant (Phase 3, optional)

This is the "AI solution" part for showcasing. It makes speakers and the owner faster without ever putting AI-written Kayan in front of learners.

```
READ FIRST: CLAUDE.md (golden rules 1, 2 and 4), docs/ETHICS_AND_DATA.md §5 (rules for AI), docs/ARCHITECTURE.md (Phase 3), docs/PROGRESS.md.

GOAL: A server-side assistant that turns verified content into ready-to-review lesson material: new lesson groupings, exercise sentences built only from verified tokens, Malay/English explanations, and questions to ask speakers. Everything goes into a review queue.

BUILD:
1. Supabase Edge Function `assist` that calls the Claude API (ANTHROPIC_API_KEY stored as a function secret, never sent to the client). It is rate-limited and restricted to owner/editor roles.
2. Tasks (each is a strict JSON output schema, validated server-side and rejected if invalid):
   a. `group-lessons`: given verified entries in a unit, propose lessons of 4–7 entries with titles in EN/MS.
   b. `explain`: given one verified entry (with its notes and sources), write a 1–2 sentence learner explanation in EN and in MS. It must not introduce any target-language word that isn't in the supplied entries.
   c. `speaker-questions`: given draft entries with conflicting sources or variants, draft the questions to ask in the next speaker session (in BM).
   d. `sentence-candidates`: propose word-bank sentences using **only** tokens that already exist in verified entries. The output is marked constructed:true and status:draft, and must be checked by a speaker.
3. A guard after every response: tokenise all target-language text in the output and reject it if any token isn't in the verified lexicon (or a supplied allowlist). Log rejections.
4. Table assist_suggestions(id, task, input_ids, output jsonb, status: pending|accepted|rejected, created_by, assisted_by:'ai'). A /review/assist screen lists suggestions to accept (which writes a proposals file) or reject.
5. Cost controls: a daily cap and a per-request max_tokens, documented in docs/BACKEND.md. Pick a current Claude model from Anthropic's docs and keep the model name in config.

CONSTRAINTS:
- Never auto-publish. Never send recordings or personal data to the API.
- The prompts sent to the model must instruct it not to invent target-language words, but the code-side guard (step 3) is what enforces this.

ACCEPTANCE:
- Unit tests for the guard (an invented word is rejected; a verified word passes).
- An end-to-end mock: a fake API response flows into the queue and is accepted as a proposal file.

FINISH: Update docs/PROGRESS.md, docs/SHOWCASE.md (describe the AI feature honestly) and commit ("feat(ai): review-queue content assistant").
```
