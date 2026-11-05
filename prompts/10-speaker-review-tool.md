# Prompt 10: Speaker review tool (offline, no backend)

```
READ FIRST: CLAUDE.md, docs/CONTENT_MODEL.md (status rules, review[]), docs/ETHICS_AND_DATA.md (consent), speaker-kit/SESSION_GUIDE.md, docs/PROGRESS.md.

GOAL: During a verification session, I can sit with a speaker and use a phone or laptop to go through entries, record their verdict and corrections, and capture their audio, all offline. Afterwards a script turns the session into a reviewable content change.

BUILD:
1. A separate route /review (hidden from the main navigation and enabled with ?review=1 or a settings toggle in draft builds), with the UI in Bahasa Malaysia by default.
2. Session setup: speaker id (a short code such as SPK01, never a real name), dialect/village, a checkbox "Consent form signed or verbal consent recorded" (required), and a unit filter.
3. For each entry, show a big form, the Malay and English gloss, variants and notes. Buttons: **Betul** (ok), **Perlu dibetulkan** (fix → text fields for the corrected form, a note and the speaker's dialect), **Tak pasti** (unsure), and **Langkau** (skip).
4. Record audio with MediaRecorder: hold or tap to record, play back, re-record. Store in IndexedDB. Show a level meter so a quiet room can be checked.
5. Export: a .zip (use fflate) containing session.json (speaker id, date, dialect, verdicts, corrections) and the audio clips named <entry-id>__<speaker-id>.webm. The exported file name includes the date and speaker id.
6. scripts/review/apply-session.ts: reads the zip and:
   - appends review[] items to entries
   - status rules: one "ok" → speaker-checked, ok from two different speakers → verified. "fix" never edits `form` automatically: it writes a proposals file (content/languages/<iso>/proposals/<date>-<speaker>.json) for the owner to accept by hand with /validate-content.
   - moves audio to audio-raw/ for prompt 06's processing script
   - prints a summary: n ok / fix / unsure, and status changes
7. Tests for apply-session (fixtures for the status transitions and the "fix doesn't overwrite" rule).

CONSTRAINTS:
- No network calls. Store no real names in session data. Credits are handled separately in language.json, with consent.
- Corrections are proposals only. The owner applies them.

ACCEPTANCE:
- A full mock session on a phone in airplane mode: 10 entries, 3 recordings, export works.
- apply-session produces the expected review[] entries, status changes and a proposals file. Validation passes afterwards.

FINISH: Update docs/PROGRESS.md and commit ("feat(review): offline speaker review tool").
```
