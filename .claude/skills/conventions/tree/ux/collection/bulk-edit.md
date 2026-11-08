---
id: ux/collection/bulk-edit
kind: rule
status: settled
---
# Bulk edit

- A bulk action over a selection is a step (a dialog), never a route: the selection lives in the view.
- On a partial failure keep the step open and the failed rows selected; close only when every row succeeded.
- Offer only the fields the bulk endpoint declares safe across records.
- A destructive bulk action confirms in a modal.
