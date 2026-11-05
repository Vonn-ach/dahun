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
