---
id: ux/record/dirty
kind: rule
status: settled
---
# Leaving a dirty record

- The leave guard asks once, with one confirm (keep editing or discard), before anything drops a dirty page-level draft: leaving the route, unloading the tab, Cancel, switching the selected record.
- A clean draft leaves, cancels and switches without asking.
- A page-level form registers its dirty state with the leave guard; a successful save leaves through the plain navigate.
- A blocking dialog never registers with the page's guard; it guards its own close with the same two choices, and a close during its save closes unasked, a later failure being a sticky toast on the view beneath.
- A commit that makes the draft moot (cancelling the record itself) discards it on success without a prompt, and its confirm says so.
