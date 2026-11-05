# Template: code review / health check

Use this every 2–3 prompts, or before a phase gate.

```
Review the code changed since [commit / tag / "the last review", see docs/PROGRESS.md].

Check, in this order, and report findings ranked by severity with file:line:
1. Golden rules (CLAUDE.md). Use the content-guardian subagent on the diff.
2. Correctness bugs and unhandled edge cases (empty course, all drafts filtered, offline, storage full, first run).
3. Engine purity and test coverage gaps in src/engine.
4. Accessibility regressions (focus, labels, contrast, motion).
5. Performance on a low-end phone (bundle size, re-renders, large lists).
6. Code that has grown too big or duplicated, with a suggested refactor (don't do it yet).

Do not change code in this session unless I approve specific fixes. End with the 3 fixes you'd do first.
```
