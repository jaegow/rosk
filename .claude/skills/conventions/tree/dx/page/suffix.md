---
id: dx/page/suffix
kind: rule
status: settled
---
# Suffix

A router-mounted module's file name says what the router does with it, after the name and before the extension.

- `<Name>.page.tsx`: a leaf route's view, a routed tab's view included.
- `<Name>.outlet.tsx`: a layout route rendering an `<Outlet/>`.
- `<Domain>.CRUD.page.tsx`: a routed view that creates, edits or deletes one record; `<Domain>.CRUD.tsx` when not router-mounted.

Anything else takes no suffix.
