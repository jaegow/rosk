---
id: ux/record/dependent-reset
kind: rule
status: open
provisional: Clear a field's dependents only on the user's own change, as a draft edit Cancel restores; never on seed or refresh; one info toast per change naming every field cleared; declare each dependency once.
---
# Dependent reset

When the user changes a field, what happens to the fields that depend on it?

- Clear dependents only on the user's own change, as a draft edit Cancel restores; never on seed or a server refresh.
- Show one info toast per change naming every field cleared.
- Declare each dependency once.
