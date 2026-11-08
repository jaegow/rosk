---
id: testing/browser/stability
kind: rule
status: settled
---
# Stability

- A failure under file parallelism is not a result; re-run the file alone, serialised, before investigating, and debug only a failure in a file you touched or one that survives that.
- Call a test flaky only when the same test fails twice under the same conditions; when the victims change run to run, the machine is overloaded.
- An action timeout with a small, varying number is the case's remaining budget, spent elsewhere, not a stuck control.
- A CI-only failure is real. When slowing JavaScript cannot reproduce it, slow the browser work the code waits on (a history call, a transition).
- A test that passes alone and fails in the suite is an earlier test's async work landing after unmount: cancel it at its source, never exempt it in setup.
- A click that times out as not visible usually hits a 0x0 box: assert the computed size of it and its offset parent.
- A typed value cut short means the app moved focus mid-typing.
- Measure speed work in script CPU time, never wall time.
- Tests run at a desktop viewport; a phone-sized default hides overlap bugs.
