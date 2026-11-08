---
id: ux/surface/full-bleed
kind: rule
status: open
provisional: A head's status band and a container's loading bar bleed today; tables and banners sit inside the padding until a list page needs them edge to edge, then they take the same mechanism.
---
# Full-bleed

- Every banner (the app banner, a head's band, a footer band, a list's applied-filters bar), a container's loading bar and a table run past their container's side padding to its edges; first or last, a band also escapes the top or bottom padding.
- The container is the nearest box that pads its content; a band in a card bleeds to the card.
- A table's first and last cells pad back by the container's padding, except a column that centres a control; filters and toolbars above it keep the padding.
