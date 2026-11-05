# Prompt 01: Scaffold

```
READ FIRST: CLAUDE.md, docs/ARCHITECTURE.md, docs/DECISIONS.md, docs/PROGRESS.md.

GOAL: An empty but production-shaped app. It runs, passes CI, and has the routes, design tokens and tooling every later prompt builds on.

BUILD:
1. Vite + React + TypeScript (strict) in the repo root. Keep the existing docs/, prompts/, content/, schemas/, speaker-kit/ and .claude/ untouched.
2. Tooling: ESLint (typescript + react-hooks + jsx-a11y), Prettier, Vitest + Testing Library, Playwright (Chromium, with a 360×800 "Pixel" mobile project and a desktop project).
3. package.json scripts exactly as listed in CLAUDE.md. For now validate:content and build:draft can be stubs that print "TODO prompt 02".
4. Folder structure from CLAUDE.md, with an index file in each feature folder and README.md one-liners in src/engine and src/storage.
5. Routes (React Router), each with a placeholder screen and a heading: / (learning path), /lesson/:id, /practice, /words, /progress, /settings, /credits. Add a bottom navigation bar for mobile (Learn, Practice, Words, Progress) and a top bar on desktop.
6. Design tokens in src/styles/tokens.css: a light and dark palette as CSS variables (dark via prefers-color-scheme plus a data-theme override), spacing, radius and type scale. Fonts: Atkinson Hyperlegible (body) and Bricolage Grotesque (display), **self-hosted** with @fontsource packages so the app works offline. Palette: river teal #0C6A5E, beadwork yellow #D99E06, red #B8372A and ink #14201C on a mist background #EAF0EC (the dark theme uses deeper equivalents).
7. A minimal UI kit in src/ui: Button (primary, ghost), Card, Chip, ProgressBeads (row of beads with level classes), Badge. Each gets a small test.
8. i18n scaffold: src/i18n/en.json, src/i18n/ms.json and a tiny useT() hook. No hard-coded UI strings in components.
9. GitHub Actions workflow .github/workflows/ci.yml: install, lint, typecheck, test, build, and Playwright smoke test on push and PR.
10. .gitignore, .editorconfig, .nvmrc (Node LTS).

CONSTRAINTS:
- No UI component library and no CSS framework unless you propose one in a DECISIONS.md entry and I approve it.
- Keep the bundle lean: no lodash or moment-style libraries.

ACCEPTANCE:
- `npm run dev` shows the app at 360px and on desktop, in light and dark mode, and all routes are reachable from the navigation.
- `npm run lint && npm run typecheck && npm run test && npm run e2e && npm run build` all pass locally. CI passes on push.
- One Playwright test visits every route on the mobile project.

FINISH: Update docs/PROGRESS.md and commit ("chore: scaffold app, tooling, CI").
```
