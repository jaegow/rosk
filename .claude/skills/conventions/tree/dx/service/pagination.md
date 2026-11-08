---
id: dx/service/pagination
kind: rule
status: settled
---
# Pagination

- A list pages in one shape per endpoint: a cursor link taken verbatim from the previous response, or `{ limit, offset }` over a total order ending in a unique column.
  Why: limit and offset over an order with ties repeat and skip rows.
- A paged query keeps the previous page on screen while the next resolves (`placeholderData` returning the previous data).
