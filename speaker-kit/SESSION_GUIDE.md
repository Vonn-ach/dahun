# Running a speaker verification session

**Goal:** turn `draft` entries into `speaker-checked` or `verified` ones, collect corrections, and record audio. One session is about 60 minutes and covers about 50 entries.

## Before

- [ ] Choose the units to cover (start with Units 1–3: greetings, numbers, people).
- [ ] Print or prepare `consent-form.md` (BM + EN). Bring two copies, one for them to keep.
- [ ] Open `verification-sheet.csv` in Google Sheets or Excel, filtered to those units. Save a copy named `session-YYYY-MM-DD-SPK01.csv`.
- [ ] Give the speaker a code (SPK01, SPK02…). Keep the code ↔ name list **privately**, never in the repo.
- [ ] Phone charged, plus a quiet room with soft furnishings (see `RECORDING_CHECKLIST.md`).
- [ ] A small thank-you: a meal, a token payment, or whatever you agreed. Note it down.

## During

1. **Explain** the project in a minute: a free app for young Kenyah to learn the language, starting with Badeng. Their words are checked by speakers like them, and they choose how they are credited.
2. **Consent**: go through the form together. If they'd rather not sign, record verbal consent at the start of the audio ("Saya setuju…").
3. **Ask about their Kenyah**: which variety (Badeng, Lepo' Tau, Lepo' Ke' or another), which village or river, and who they learned from. Write it in `speaker_dialect_or_village`. If their variety isn't Badeng, a different word is a **variant for their variety**, not a correction of the Badeng form.
4. **Go through the entries.** For each one, read the Malay meaning first and ask: *"Macam mana sebut '…' dalam bahasa Kenyah?"* Let them say it **before** you show the written draft. Then show the draft and ask whether it is right or how they would write it.
   - Correct → `correct_Y_N_unsure` = Y
   - Different → N, and write their form in `corrected_form` exactly as they spell it (or as they agree you should spell it)
   - Not sure / not used in their area → unsure, plus a note
   - Any extra word or usage they mention → `usage_note`
5. **Record** each confirmed form: say the entry id aloud first ("xkl-zero-zero-five-eight"), then they say the word twice with a short pause. Mark `audio_recorded_Y_N` = Y.
6. **Ask what shouldn't be in the app**: are any of these words or topics private, sacred or rude in some contexts?
7. **Take breaks** every 20 minutes. Stop when they're tired. Fifteen good entries beat fifty rushed ones.

## After

- [ ] Fill in `speaker_code` and `date` for every row you covered.
- [ ] Copy the audio off your phone into `audio-raw/xkl/` (this folder is git-ignored). Then run the audio prompt (06) or `scripts/audio/process.ts`.
- [ ] In Claude Code, paste `prompts/templates/content-batch.md` with your CSV path. Corrections become **proposals** for you to approve; they never overwrite anything automatically.
- [ ] Log the session in `docs/PROGRESS.md` (content status table).
- [ ] Send the speaker a thank-you. Tell them what you'll do with the recordings, and show them the app when their words appear.

## Two-speaker rule

An entry becomes `verified` when two different speakers confirm it (or one speaker plus a reliable source). When speakers disagree, keep both forms: the more common one as `form` for the chosen dialect, the other in `variants` with a dialect or village note. Don't pick a "winner" yourself; ask a third speaker.
