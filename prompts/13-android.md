# Prompt 13: Android app (Phase 4)

```
READ FIRST: CLAUDE.md, docs/ARCHITECTURE.md (Phase 4), docs/DEPLOY.md, docs/PROGRESS.md.

GOAL: A signed Android build on Google Play that bundles the content and audio, so the first launch works offline.

BUILD:
1. Add Capacitor (android only). The web build output is the app. Bundle the release content and the processed audio in the APK/AAB, and skip runtime downloads for them.
2. App id (e.g. my.dahun.app — confirm with me), name, adaptive icon from the beadwork SVG, splash screen in tokens colours, and status bar colours per theme.
3. Android back button: inside a lesson it asks "End this lesson?" (an in-app dialog); on home it exits.
4. Keep the PWA and Android builds in sync from one codebase. Document `npm run android:build` and `npm run android:open`.
5. docs/PLAY_STORE.md: a step-by-step checklist for me covering the Play Console account, app signing, the data safety form (answers for no data collected, or for Phase 3 accounts if enabled), content rating, a privacy policy URL, the store listing in EN + BM (generate the text and screenshots) and an internal testing track.
6. A GitHub Actions job that builds a release AAB on tags (v*). Signing keys come from repo secrets, never committed.

ACCEPTANCE:
- The debug APK installs on a real Android phone and runs a lesson with audio in airplane mode on its first launch.
- The release AAB builds in CI from a tag.

FINISH: Update docs/PROGRESS.md and commit ("feat(android): capacitor build").
```
