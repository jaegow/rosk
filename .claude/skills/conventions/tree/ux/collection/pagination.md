---
id: ux/collection/pagination
kind: rule
status: settled
---
# Pagination

- Page a list on the server with the page in the URL; a server-paged list also sorts and counts on the server.
- Show no pager when the count is at most the opening page size; show it when larger or unknown.
- Show no rows-per-page select when one size is offered.
- A table whose rows its parent record carries whole sorts and pages in the browser.
- A history whose endpoint cannot filter loads whole up to a cap and filters in the browser; past the cap it says older entries are not shown.
