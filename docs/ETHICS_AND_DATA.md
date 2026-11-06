# Ethics, consent and data

This is a language that belongs to a living community. The app is only as trustworthy as the way the content was gathered. These rules apply to the owner, to contributors and to Claude Code.

> This document is practical guidance, not legal advice. Before public launch, have someone with legal knowledge review the consent form and the content licence.

## 1. Work *with* the community

Follow the **CARE Principles for Indigenous Data Governance** (Global Indigenous Data Alliance):

- **Collective benefit**: the app should serve Kenyah people first (free to learn, offline, heritage learners as the main audience).
- **Authority to control**: speakers and the community decide what is taught, how it is spelled, and what stays private.
- **Responsibility**: be open about sources, errors and how content is used. Credit people.
- **Ethics**: avoid harm. Some cultural knowledge (ritual, customary law, sacred songs and stories) may not be appropriate for a public app. **Ask before including it**, even when you know it yourself.

In practice:

- Before public launch, get written support from at least one community body: a longhouse headman (*Ketua Kaum*), a church or community association, or a Kenyah cultural group. Being a Kenyah speaker yourself doesn't replace this. Keep a copy in a private folder, not in the public repo.
- Offer contributors a way to be credited by name, by initials, or anonymously, and honour it.
- Budget something for speakers' time (a meal, a token payment, or credit in grant applications). Write down what was agreed.
- Run a "Report a problem with this word" flow in the app, and correct reported errors quickly and publicly (`content/CHANGELOG.md`).

## 2. Consent for recordings and corrections

- Use `speaker-kit/consent-form.md` (Malay + English) **before** recording anyone. Record verbal consent at the start of the audio if the person prefers not to sign.
- The form's section 4 is a personal data notice in the style of the PDPA (what is collected, why, who sees it, where it's kept and for how long, and how to see, correct or complain). Fill in its blanks and have it reviewed before first use. The points to raise are in `speaker-kit/README.md`.
- A voice recording is personal data. Store originals privately (not in the public repo) and publish only the trimmed clips the speaker agreed to.
- Speakers can withdraw. On request, remove their clips and credit within 30 days, and record the removal in `content/CHANGELOG.md`.
- **Minors**: do not record anyone under 18 without a parent's or guardian's written consent.

## 3. Content licensing

- **Code**: MIT (see `LICENSE`).
- **Language content and audio**: not open-licensed by default. See `content/LICENSE-CONTENT.md`. Decide the final licence *with* the community. Options include CC BY-NC-SA 4.0 or Traditional Knowledge labels from Local Contexts (localcontexts.org).
- **Third-party sources** (`content/SOURCES.md`):
  - *ABVD* (Austronesian Basic Vocabulary Database): open-licensed with attribution. Confirm the exact licence on the ABVD site and keep its citation in the credits.
  - Dictionaries, word lists and church or school materials still under copyright: use them only as a **reference to check** words, never to copy definitions, examples or large lists. Speaker-verified forms are the speakers' contribution. (The earlier Kayan seed relied on Southwell's *Kayan–English Dictionary* this way; see the tag `kayan-seed-v1`.)
  - *Borneo Dictionary* (community website) and blogs: credit them, ask permission before relying on them heavily, and re-verify every entry with speakers.

## 4. Learner privacy (Malaysia PDPA 2010, as amended)

- **Phase 1 collects no personal data.** Progress stays in the browser or device. No analytics SDKs, ad IDs or third-party scripts.
- If you later add analytics, use a privacy-friendly, cookieless tool, publish a privacy notice in BM and EN, and make it opt-in.
- **Phase 3 accounts**: collect the minimum (email, display name). Host in the Singapore region. Let users export and delete their data. Write a privacy notice in BM and EN before launch.
- Do not target children under 13 with accounts. The learning part can stay account-free for everyone.

## 5. Rules for AI (including Claude Code)

- AI must **never generate indigenous-language text** that learners see as correct. Large language models know very little Kenyah and will make up plausible but wrong forms. This applies even with a Kenyah-speaking owner: the owner gives the words, AI never suggests them.
- AI **may** help with: code, UI copy in English and Malay, explanations that only re-use verified entries, choosing distractors from verified entries, formatting speaker input, and drafting questions for speakers.
- AI-assisted content goes through the same review queue as human-entered content. Record `"assistedBy": "ai"` in the review entry.
- Never send speakers' recordings or personal data to a third-party AI service without their explicit consent.

## 6. Public showcase (Rakyat Builders Hub, GitHub)

- The repo is public. Keep out of it: consent forms, contact details, raw recordings, and community letters.
- Describe the content status honestly in the README ("X entries verified by Y speakers").
