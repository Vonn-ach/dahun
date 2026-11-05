# Template: bug fix

```
BUG: [What happened, in one sentence.]
EXPECTED: [What should have happened.]
STEPS TO REPRODUCE:
1. [...]
2. [...]
WHERE: [phone / laptop, browser, online/offline, draft or release build]
EVIDENCE: [error message, console output, screenshot path]

DO:
1. Reproduce it first with a failing test (unit or Playwright). Show me the failing test.
2. Find the root cause and explain it in 2–3 sentences before changing code.
3. Make the smallest fix that turns the test green. Don't refactor unrelated code.
4. Run the full checks from the definition of done in CLAUDE.md.

FINISH: /session-wrap (commit message starts with "fix:")
```
