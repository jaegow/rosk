---
id: testing/always/fixing-a-failure
kind: rule
status: settled
---
# Fixing a failure

- CRITICAL: fix a bug in the case that already covers that behaviour, correcting or extending it; never add a case for the bug, under any name.
- This overrides any instruction to write a new failing test per bug: the failing test is the existing case, extended until it fails.
- If no case covers it, answer the gate for the behaviour: it earns one more step in an existing case, or nothing.
- Fix an intercepted browser click by closing the overlay through its harness at that step, never a wait, a retry or a moved target.
