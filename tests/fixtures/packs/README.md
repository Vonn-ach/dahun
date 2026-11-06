Fixture language packs for the content script tests (`scripts/lib/*.test.ts`). `tst` ("Testish") is not a real language: its forms are placeholder words, never text from Kayan or any other Borneo language.

- `valid/`: passes with no errors and no warnings. It has verified, speaker-checked and draft entries, so the release, beta and draft bundles all differ.
- `broken-refs/`: `valid/` plus references to ids, sentences, a dialect and a source that don't exist.
- `duplicate-ids/`: `valid/` plus a repeated entry id, a repeated sentence id, and an entry introduced in two lessons.
- `missing-audio/`: `valid/` plus an `audio[]` item whose file isn't in `audio/`, and an audio file nothing points at.

Other cases are tested by copying `valid/` to a temp folder and changing it there (`copyFixture` in `scripts/lib/test-helpers.ts`).
