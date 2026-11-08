---
id: ux/collection/state
kind: rule
status: settled
---
# Where list state lives

- What changes which data shows (search, filters, sort, page, the selected item) lives in the URL; what changes only presentation (column visibility and order, rows per page) lives in local storage.
- Ask whether a colleague opening the link would expect it applied; give each piece one home.
- A modal picker starts fresh each open and discards its state on close; an inline picker keeps it while on screen.
