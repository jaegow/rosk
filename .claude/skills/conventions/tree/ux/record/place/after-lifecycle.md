---
id: ux/record/place/after-lifecycle
kind: rule
status: settled
---
# After a lifecycle action

- An action reading saved values the user can edit refuses while any of them is unsaved: clickable, its press toasts what to save first, before any dialog. Never save or discard edits to make it run.
- If it yields a new record, go to it; otherwise stay and refresh in place, giving only the changed properties the server's values and keeping every other edit.
- Never raise the updated-elsewhere warning for the user's own action.
