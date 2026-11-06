# Product requirements — Dahun

## Vision

Anyone with a phone can learn a Borneo indigenous language in five minutes a day, using content that speakers of that language have checked and recorded, and that credits them.

## Problem

- Kenyah and most other Borneo languages are passed on mainly by speaking at home. Many young Kenyah, especially those in towns and in West Malaysia, understand little or none of the language.
- There is no Duolingo course and no learning app for Kenyah, and almost no recorded audio for learners. Kenyah is a family of varieties (Badeng, Lepo' Tau, Lepo' Ke' and others) with different words and spellings, and written materials are scattered.
- The big apps do not cover small languages, and their gamification often punishes people who miss days.

## Users

| Persona | Needs |
|---|---|
| **Heritage learner** (18–35, Kenyah parents, grew up in a town) | Talk with grandparents, feel connected, not be embarrassed. Wants real pronunciation. |
| **Sarawakian non-Kenyah** (colleague, spouse, posted to a Kenyah area) | Greetings, numbers, everyday phrases, cultural respect. |
| **Teacher / community organiser** | Point a class or youth group at structured content and see that it is accurate. |
| **Speaker / contributor** (elder or fluent adult) | Check words, record audio, and be credited. Simple, phone-based, in Malay. |

## MVP scope (Phase 1)

1. **One course: Kenyah (Badeng variety)**, in `content/languages/xkl/`. Other Kenyah varieties appear as labelled variants when their speakers add them. About 10 units and 40–60 lessons. The words come from Badeng speakers, starting with the owner, and none are written by AI (D016).
2. **Learning path**: units → lessons. Lessons unlock in order, but any unit can be opened (no hard gating).
3. **Lesson player** with these exercise types: intro card, pick the meaning, pick the word, match pairs, type the word (lenient on small spelling slips the language pack lists, with a spelling nudge), build the sentence, and listen-and-pick (only when audio exists).
4. **Spaced review**: a "Practice" button builds a 2/5/10-minute session from due items.
5. **Progress**: XP, a weekly practice view (no fragile streak), per-unit bead progress, and backup/restore to a file.
6. **Offline PWA**: installable on Android and desktop, and works with no signal after the first load.
7. **UI in Bahasa Malaysia and English**, switchable.
8. **Content status shown honestly**: draft content carries a badge in dev builds. Release builds include verified content only.
9. **Credits screen** listing speakers (with their permission) and sources.

## Non-goals for the MVP

Accounts, cloud sync, leaderboards, social features, speech recognition, AI chat tutors, ads, payments and an iOS App Store build.

## Success measures

- **Learning**: a learner who finishes Unit 1–3 can greet, introduce themselves and count to 20 in a 2-minute chat with a speaker.
- **Use**: of 20 beta learners, at least 50% are still practising after 7 days and 30% after 30 days.
- **Content**: at least 300 lexicon entries verified by two speakers, and at least 150 with audio, before public launch.
- **Community**: at least 3 credited speakers, plus written support from at least one community organisation or longhouse leader.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Content errors embarrass learners or the community | Two-speaker verification, status gating, an in-app "Report a problem" link, and a public changelog of corrections |
| Dialect disagreement (Badeng vs other Kenyah varieties, village variation) | Start with one variety (Badeng); store dialect per entry; add other varieties as labelled variants from their own speakers; let learners pick a variety at onboarding; never declare one "correct" |
| No audio | Speaker recording sessions are part of the roadmap; ship text-only lessons first |
| Scope creep | Phase gates in `docs/ROADMAP.md`. A second language starts only after the Kenyah gate is met |
| Builder burnout | 2-week milestones, prompts sized for one session each, `docs/PROGRESS.md` log |
| Data or IP disputes | Consent forms, a content licence agreed with the community, and attribution for every source |
