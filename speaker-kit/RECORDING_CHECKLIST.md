# Recording checklist (phone is fine)

## Room

- Small room with soft things (curtains, bed, sofa, clothes). Avoid tiled bathrooms and kitchens.
- Fans and air-conditioning off for the takes, phones on silent, no TV. Watch out for roosters, rain on a zinc roof and motorbikes.

## Phone

- Use a voice-recorder app that saves **WAV or high-quality M4A** (on Android: the built-in Recorder set to high quality, or any app that saves 44.1/48 kHz). Avoid WhatsApp voice notes, which are heavily compressed.
- Hold or prop the phone **about 20–30 cm** (one hand-span) from the mouth, slightly to the side to avoid puffs of air on "p" and "b". Same distance every time.
- Do a 5-second test and listen back with earphones. It should sound clear, not boomy, and not clipped.

## Takes

- One file per batch is fine. Say the **entry id** before each word ("xkl zero-zero-five-eight"), then the speaker says the word **twice**, naturally, with a pause of about 1 second.
- For phrases, ask for a natural, everyday speed, not slow syllables.
- If they want to correct something, just do another take. The processing script keeps the last one.

## Files

- Name each batch `YYYY-MM-DD_SPK01_unit1.m4a` (or .wav).
- Copy it to the laptop into `audio-raw/xkl/`. This folder is **git-ignored**: raw audio never goes to GitHub.
- Back up the raw files somewhere private (an external drive or a private cloud folder).
- Trimming, naming per entry, loudness and conversion are done by `scripts/audio/process.ts` (prompt 06).
