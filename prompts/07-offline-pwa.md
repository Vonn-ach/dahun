# Prompt 07: Offline PWA + install

```
READ FIRST: CLAUDE.md, docs/ARCHITECTURE.md (offline first), vite.config.ts, docs/PROGRESS.md.

GOAL: The app installs on Android and desktop like a native app and works fully offline after the first visit, including the content bundle.

BUILD:
1. vite-plugin-pwa with injectManifest or generateSW (explain your choice briefly):
   - Precache the app shell, fonts and the current content bundle(s).
   - Runtime-cache audio with CacheFirst and an expiry, as set up in prompt 06 if it's done.
   - Navigation fallback to index.html for client routes.
2. Web app manifest: name "Dahun", short_name "Dahun", theme/background colours from the tokens, display standalone, portrait-primary, maskable icons (192, 512) and screenshots for the install sheet. Generate icons from a source SVG of the beadwork mark (3×3 beads on teal), and put the SVG in public/.
3. Update flow: when a new version is ready, show a small "Update available" toast that reloads when tapped. Never reload in the middle of a lesson.
4. Install prompt: a quiet "Install Dahun" card on the home screen after the learner's 2nd completed lesson. It is dismissible and never shown again once dismissed. On iOS Safari, show the "Share → Add to Home Screen" hint instead.
5. An offline indicator in the header, only when it matters ("Offline · everything still works").
6. Persistent storage: call navigator.storage.persist() after the first completed lesson, and show storage use in settings.

ACCEPTANCE:
- Lighthouse PWA checks pass. Installed on an Android phone, the app opens and runs a full lesson in airplane mode.
- Playwright test with context.setOffline(true) after the first load: the path and a lesson still work.

FINISH: Update docs/PROGRESS.md and commit ("feat(pwa): offline + install").
```
