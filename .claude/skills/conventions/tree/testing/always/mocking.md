---
id: testing/always/mocking
kind: rule
status: settled
---
# Mocking

Mock at the service boundary and nowhere else.

- A service's own unit test mocks the one fetch wrapper its entries call through, proving URL, method, headers and body. Only the wrapper's own test touches raw `fetch`.
- Every other test (hooks, components, journeys) mocks service entries through a `setup.<name>.ts` case in `src/testing/`, which `vi.spyOn`s one entry and returns `{ mock, spy }`; never an inline spy in a test file.
- The runner restores every spy, stubbed global and stubbed env after each case; never restore one by hand.
- A read that must hang returns a deferred the test settles either way.
- A case seeded by id rejects an id it was not given, naming it; a missing record has its own case.
- Never mock a component, a hook, a store, the router or `document`, and never `vi.mock` in a browser test. A unit test that does is wrong: move it to the service seam.
- Two named exceptions: the counted child in a render-count test, and a third-party component whose failure callback no browser test can drive, each alone in its own file.
- A mock replaces the function, not the wire, so a green test never proves the server accepts the payload.
