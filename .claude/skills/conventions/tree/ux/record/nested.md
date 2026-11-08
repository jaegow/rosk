---
id: ux/record/nested
kind: rule
status: settled
---
# Nested entity

A nested entity is a child record, a record this one references, or a part that saves through its own endpoint.

- Open its create or edit in its detail modal, never navigating away and never in an editor that grows content in place.
- A fixed set of fields switching between read-only and editable in place, keeping its layout, is the one exception.
- It saves on its own, never through the parent's Save.
