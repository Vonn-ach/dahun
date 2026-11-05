# Template: apply a speaker session to the content

Use this after a verification session if you entered results in `speaker-kit/verification-sheet.csv` instead of using the review tool from prompt 10.

```
I ran a speaker verification session. The results are in [path to CSV] (columns as in speaker-kit/verification-sheet.csv). Speaker code: [SPK01], dialect/village: [...], date: [YYYY-MM-DD].

DO:
1. Write or reuse scripts/review/apply-sheet.ts to read the CSV.
2. For rows marked correct = Y: append a review[] item {speaker, date, verdict:"ok"} and update the status following docs/CONTENT_MODEL.md.
3. For rows with a corrected_form: do NOT edit `form`. Write content/languages/kys/proposals/[date]-[speaker].json listing the entry id, current form, proposed form, dialect and note. Then show me the proposals as a table so I can approve each one.
4. When I approve proposals, apply exactly the approved ones (form and/or variants) and append a review[] item with verdict "fix" and the comment.
5. For rows with new entries the speaker volunteered, add them as new draft entries with the next free ids, source "speaker:[SPK01]", and leave them out of lessons.
6. Run /validate-content and summarise: n confirmed, n corrected, n new, and status counts per unit.

Never change any form I haven't approved in this conversation.
```
