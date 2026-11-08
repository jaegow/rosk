---
id: testing/always/placement
kind: rule
status: settled
---
# Placement and naming

- Name a test for its project: `X.test.unit.ts` (unit-node), `X.test.unit.tsx` or `useX.test.unit.ts` (unit, jsdom), `X.test.browser.tsx` (browser).
- Colocate a test beside the file it covers; `src/testing/` holds only shared infrastructure: setup files, harness helpers, service-mock setup cases.
- A helper one test file uses lives inline in it; one shared by two or more lives beside the feature, or in `src/testing/helpers/` when it is cross-feature.
- A new test file that matches no project runs nowhere and stays green: confirm the run lists it.
- Title a case for the behaviour it proves, in the words a user or caller would use; the title is where the case's reasoning lives.
