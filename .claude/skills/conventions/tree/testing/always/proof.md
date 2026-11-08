---
id: testing/always/proof
kind: rule
status: settled
---
# Proof

- The unit and browser setups stub `fetch` to reject, naming the URL and method. Read that error as a missing mock and never loosen the stub.
- See a new assertion fail before trusting it: invert it, or put the old source back, for one run.
- Distrust a matcher several signals can satisfy; it proves only that one held.
- A green suite proves nothing about a lost case: diff `describe` and `it` titles against the base branch.
