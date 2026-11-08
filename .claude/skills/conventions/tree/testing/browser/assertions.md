---
id: testing/browser/assertions
kind: rule
status: settled
---
# Assertions

- Assert what a user perceives: copy, presence, roles, state (`aria-selected`, `aria-current`), and what an interaction causes.
- Never assert a size, variant or colour prop or a class naming one; never add an attribute only to make paint testable.
- Assert the em dash for an empty value the view shows, and absence only for a field that does not apply.
- Prove a toast was raised through the toast harness's raised count, polled; a toast can leave before the click that raised it returns. Prove "never raised" the same way, counting from just before the action. The raised log resets per test.
- Match a toast's own message, anchored; an "any error toast" read also sees the shell's.
