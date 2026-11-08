---
id: testing/browser/journey
kind: rule
status: settled
---
# Browser journey

CRITICAL: a journey proves how a user moves through a flow and what they see along it. It never asserts layout, position, order, geometry or paint.

- Keep one journey `it` per flow; add a step to the journey that walks it rather than a new case.
- Mount the app, seed the session and any deep link before render, and reach the screen through real navigation.
- Render the real components, hooks and stores; mock only service entries.
- The gallery takes one smoke journey proving its own discovery and routing; never a journey or case per gallery member, since each member's own test covers it.
- Never assert retired UI is absent.
- Never re-assert a mapping a unit test pins.
- A form journey walks: pristine load with no errors; a save calling the spy with the full payload and leaving the form clean; a failed save showing a field-keyed error on its field with no toast, edits kept; a required field refusing the submit.
- A leave guard is driven through its own dialog: declining keeps state, accepting leaves.
- End each journey asserting no unexpected error toast was raised.
- Check a split seam by running the second half alone before splitting a journey.

## Also
- [Assertions](assertions.md)
- [Waits](waits.md)
- [Stability](stability.md)
