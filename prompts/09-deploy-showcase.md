# Prompt 09: Deploy + showcase

```
READ FIRST: CLAUDE.md, README.md, docs/ROADMAP.md (Phase 1 gate), .github/workflows/, docs/PROGRESS.md.

GOAL: Every push to main deploys automatically. There is a public demo link, and the repo reads well for the Rakyat Builders Hub, testers and potential community partners.

BUILD:
1. Deployment with GitHub Actions to Cloudflare Pages (preferred: fast in Malaysia, free) or GitHub Pages (fallback; set the Vite base path correctly). Two targets:
   - `main` → release build (verified content only) → production URL
   - `preview` branch → `build:draft` → preview URL, with a visible "Preview: includes unverified content" banner
   Document the one-time setup steps I need to do by hand (accounts, tokens and repo secrets) in docs/DEPLOY.md, step by step.
2. Security headers via _headers (CSP allowing only self + data: for fonts/images, no third-party scripts), and a 404 → SPA fallback.
3. README: update the status line, demo links, 3 screenshots (generate them with Playwright at 360×800 into docs/screenshots/), a short GIF or a sequence of screenshots of a lesson, a "How it's built" section, and a "Help with content" call to action.
4. docs/SHOWCASE.md: a 150-word project description for the Rakyat Builders Hub in English and Bahasa Malaysia, 5 bullet highlights, the tech stack, what is AI-assisted and how (Claude Code for development; no AI-generated Kenyah), and current metrics from PROGRESS.md.
5. Feedback: a "Report a problem" link on every entry and summary screen that opens a prefilled GitHub issue (entry id, form, screen) using the issue template .github/ISSUE_TEMPLATE/content-problem.yml. Also add a bug template.
6. Run /ship-check, and fix anything it flags.

ACCEPTANCE:
- Production and preview URLs both work on a phone and can be installed. The README shows the screenshots and links.
- Phase 1 gate in docs/ROADMAP.md is checked off honestly, with any gaps listed in PROGRESS.md.

FINISH: Update docs/PROGRESS.md and commit ("chore: deploy + showcase").
```
