---
paths:
  - "src/**/*.test.*"
  - "scripts/**/*.test.*"
  - "src/testing/**"
---

Before writing, changing or fixing a test, read `.claude/skills/conventions/SKILL.md` and walk the tree's testing branch for each test you add, change or fix.
- Unit-node for pure logic, unit jsdom for hooks and light renders, browser for components and journeys.
- A browser journey never asserts layout, position, order, geometry or paint; a component's own test may assert its layout contract.
- Add no regression case and no invented case.
- Fix a failure in the case that already covers that behaviour; never add a case for the bug.
- Rewrite or delete every case a change made stale.
