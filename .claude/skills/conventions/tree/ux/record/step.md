---
id: ux/record/step
kind: rule
status: settled
---
# The detail modal

- CRITICAL: give a record one modal carrying every state the user can reach: read-only, create, edit and delete; never a modal per action.
- Open it read-only for a record the user cannot change.
- Delete is a state of the same modal: its Delete switches the footer to confirming, Cancel `secondary` and Confirm `primary`.
- Open it from the thing it shows and return there on close; close it on success.
- Close a create without asking while it holds only what it opened with.
- Never promote a modal opened from a record view to a route for its size.

## Also
- [Field choice](field.md)
- [Dirty](dirty.md)
