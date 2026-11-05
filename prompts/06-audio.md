# Prompt 06: Audio

Run this once you have at least about 20 recorded clips (see `speaker-kit/RECORDING_CHECKLIST.md`).

```
READ FIRST: CLAUDE.md (golden rule 3: no TTS), docs/CONTENT_MODEL.md (audio fields), docs/PEDAGOGY.md (listen-pick), speaker-kit/RECORDING_CHECKLIST.md, docs/PROGRESS.md.

GOAL: Entries with recorded audio can be heard everywhere they appear, and the learner gets listening exercises. The app still works offline.

BUILD:
1. scripts/audio/process.ts (Node, using ffmpeg if it's installed and printing install instructions if not): takes raw files from a git-ignored folder (audio-raw/<iso>/), trims silence, normalises loudness to about −16 LUFS, converts to mono AAC .m4a at 64 kbps (keep an .ogg fallback only if needed), names files <entry-id>__<speaker-id>.m4a, and writes them to content/languages/<iso>/audio/.
2. scripts/audio/link.ts: reads a CSV (entry_id, speaker_id, file, dialect), adds `audio[]` items to lexicon entries, and prints a diff for review. Changing `audio[]` is allowed. Changing `form` is not.
3. Validation: every audio file referenced exists, there are no orphan files (warning), and file size is under 150 KB (warning).
4. src/features/audio/: useAudio(entry) and a small AudioButton (big tap target, keyboard "Space" to replay). Prefer the speaker matching the learner's dialect.
5. Exercise listen-pick (play audio → pick the written form), added to lesson plans and practice rounds when audio exists. Intro cards auto-play once (unless calm mode is on, or sound is muted at the OS level).
6. Offline: the PWA runtime-caches audio for the current unit, with a "Download all audio for offline" button in settings that shows the size.

CONSTRAINTS:
- No TTS and no synthesized fallback. No audio means no audio button.
- Raw recordings (audio-raw/) stay out of git and are listed in .gitignore.

ACCEPTANCE:
- With a few sample clips, they play in intro, feedback and the Words screen. listen-pick appears. Airplane mode after "Download all" still plays them.
- Tests for the CSV linker and validation.

FINISH: Update docs/PROGRESS.md (with an audio coverage count) and commit ("feat(audio): playback, processing, listen exercises").
```
