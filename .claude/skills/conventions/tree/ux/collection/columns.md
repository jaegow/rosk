---
id: ux/collection/columns
kind: rule
status: open
provisional: The table ships no column selector and no drag-scroll; apply the alignment, row-action and one-line rules, and build those two with the first list that needs them.
---
# Columns

- Right-align what the reader compares down a column (amounts, counts, percentages); centre a column of chips or of actions; keep identifiers left.
- Give each row action one fixed place in every row; where a row lacks it, keep the place invisible and out of the tab order. An action nobody can take is hidden in every row.
- Set every header on the header row's bottom line, so wrapped labels and sort arrows sit level.
- Pin row actions to the trailing edge, never hideable; size a pinned control column to its controls.
- Prefer horizontal scroll to narrowing a column below its header.
- Keep every cell to one line; cap a long free-text column and cut it with its full text on hover.
- A field in a cell takes the form's default size and fills its column.
- Let the reader reorder and hide columns from a column selector with a Reset; the order is a presentation preference.
- A drag anywhere in a table scrolls it with a mouse; a press that barely moves stays a click; touch keeps native scrolling.
