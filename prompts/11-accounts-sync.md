# Prompt 11: Accounts + progress sync (Phase 3)

Run this only after the Phase 2 gate is met, and after adding the privacy notice in `docs/ETHICS_AND_DATA.md`.

```
READ FIRST: CLAUDE.md (golden rule 6), docs/ARCHITECTURE.md (Phase 3), docs/ETHICS_AND_DATA.md (learner privacy), src/features/progress/backup.ts, docs/PROGRESS.md.

GOAL: Learners can optionally sign in so their progress follows them between phone and laptop. The app stays fully usable without an account.

BUILD:
1. Supabase project (Singapore region). Write the setup steps I must do by hand into docs/BACKEND.md. Keep keys in .env (anon key only in the client) and document them in .env.example.
2. SQL migrations in supabase/migrations/: profiles(id, display_name, created_at) and progress_snapshots(user_id, course, data jsonb, updated_at), with Row Level Security so users can only read and write their own rows.
3. Auth: email magic link + Google. The account screen lives under /settings and includes "Delete my account and data" (an Edge Function that deletes rows and the auth user).
4. Sync: on sign-in, on app focus, and 10 s after the last change (debounced), merge local ↔ remote using the backup merge rules (per item, newer wins). Make it work offline-first: queue changes and sync when back online. Show the sync status quietly in settings.
5. A privacy notice page (/privacy) in EN + BM, linked from sign-in. It states exactly what is stored, where (Singapore), why, and how to delete it.

CONSTRAINTS:
- No analytics and no third-party trackers. Signing in is never required to learn.
- Never log progress payloads or emails in client console output.

ACCEPTANCE:
- Two browsers signed in to the same account converge after offline edits on both.
- RLS tested: user A cannot read user B's rows (SQL test or integration test).
- Delete-account removes all rows.

FINISH: Update docs/PROGRESS.md + docs/DECISIONS.md and commit ("feat: optional accounts + sync").
```
