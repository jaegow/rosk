---
id: dx/view/table
kind: rule
status: settled
---
# Table

- Declare a row type with `type`, never an interface, so it satisfies the table's record constraint.
- If a table paginates, state whether its pager shows: shown when the row count exceeds the opening page size or is unknown.
- A control in a row is the table's row CTA, given through the table's row CTAs, never a plain `CTA` in a cell.
- A sortable column is marked on its column; the table draws the header control, never the caller.
- If rows link, a cell value that opens what it names is the row CTA as a link, never an `<a>`.
- If a table lists a form's array rows, read each cell's value from the form, never the row as it was added.
- A list reports its first read's loading and failure on its page gate and renders the table meanwhile; the table shows the wait or failure in its own body.
