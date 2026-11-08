---
id: testing/unit/node
kind: rule
status: settled
---
# unit-node

The default project: no DOM, cheapest per file.

- Use it for pure logic, request building and scripts; storage works in memory here, so a storage test needs no jsdom.
- Assert a decision on its string-union outcome, never its prose, so rewording copy breaks no logic test.
- Cover a mapping (a copy map, a rule table, a parser) one row per branch here, and leave one browser step proving the wiring.
- Assert a generic's constraint through its resolved parameter type (`expectTypeOf<Parameters<typeof fn>[0]>()`), never a rejected call under `@ts-expect-error`; widen the source once to see it fail.

## Also
- [Mocking](../always/mocking.md)
