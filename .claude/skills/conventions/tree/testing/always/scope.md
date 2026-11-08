---
id: testing/always/scope
kind: rule
status: settled
---
# Which cases exist

These hold for every layer.

- Never write a regression case (one guarding a past bug, race or crash, or pinning old behaviour); delete one on sight.
- Never invent a case: every case proves what the live code does on a path a user or caller takes.
- Add nothing when an existing case proves the behaviour, or when the change is layout, order or styling alone.
- In the same change, rewrite or delete every case it made stale: one asserting removed behaviour, one asserting retired UI is absent, one repeating another.

Why: regression and invented cases make the suite slow and assert behaviour nobody can name.
