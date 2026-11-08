---
id: testing/unit/jsdom
kind: rule
status: settled
---
# unit (jsdom)

Opt in only when a DOM is needed: building jsdom dominates the file's cost.

- Use it for `renderHook` (`use*.test.unit.ts`), a light render (`*.test.unit.tsx`) asserting text, roles and calls, and a harness helper's own test.
- Never assert layout, geometry or computed style here: jsdom measures nothing.
- A render count proves only re-render scope, in its own file, mocking the counted child.
- A negative read through rendered output is vacuous when the value recomputes the same either way; assert on the subscriber's own spy instead.

## Also
- [Mocking](../always/mocking.md)
