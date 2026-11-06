# Speaker kit

Everything you need to check content and record audio with Kayan speakers. These files are for people, not code.

| File | Use |
|---|---|
| `SESSION_GUIDE.md` | How to run a 60-minute verification and recording session |
| `consent-form.md` | Bilingual (BM/EN) consent form. Print it or share it. Keep signed copies **private** |
| `verification-sheet.csv` | Every entry and sentence (210 + 14 today), ready to tick off in Excel or Google Sheets. The `note_in_draft` column has the usage notes, some with Kayan words for the speaker to check. It is made from the content files by `npm run sheet`, so don't edit it by hand: save a copy for each session |
| `RECORDING_CHECKLIST.md` | Getting clean audio with a phone |

After a session, use `prompts/templates/content-batch.md` in Claude Code to turn the sheet into content updates.

## Before using the consent form

The consent form is a draft, not legal advice. Section 4 (the personal data notice) was drafted by Claude on 2026-11-06. Before the first session:

1. **Fill in the blanks:**
   - your email and phone
   - who else, if anyone, sees the forms and full recordings
   - where they are kept, including the country if you use a cloud service
   - how many years after the project ends they are deleted
   - the JPDP's current contact details
2. **Ask someone with legal knowledge to review it.** Points to raise:
   - **Does Malaysia's PDPA 2010 apply at all?** It covers personal data in commercial transactions, and Dahun is free. The form follows it anyway, as good practice and in case the project later takes grants or sponsorship.
   - **Are voice recordings "biometric data"** (sensitive personal data under the 2024 amendments) when they are used only as clips to play, never to identify anyone? Either way, the form asks for explicit consent.
   - **Is 21 days the right reply time** for requests to see or correct data?
   - **Storing data outside Malaysia:** a cloud service now, and Supabase in Singapore in Phase 3.
3. **Ask a fluent Malay speaker to read the BM text.** It has no Kayan in it.
