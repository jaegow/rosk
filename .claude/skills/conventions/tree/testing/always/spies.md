---
id: testing/always/spies
kind: rule
status: settled
---
# Spies and matchers

- CRITICAL: assert `toHaveBeenCalledWith` with the full literal payload; never a bare `toHaveBeenCalled()` (`.not.toHaveBeenCalled()` is fine).
- Use `expect.any` or `expect.objectContaining` only on the one field that is unpredictable (a timestamp, a random id).
- A spy called with nothing still asserts `toHaveBeenCalledWith()`.
- For a rejection, assert the fields that identify the failure (`toMatchObject` on status and body).
