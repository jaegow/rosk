---
id: ux/surface/tab-group
kind: rule
status: settled
---
# Tab group

A tab group puts like destinations in one tab bar at the top of a page, reached by one nav row.

- Compose the bar in the page and state its rules there: which tabs show, where a URL naming no tab lands, the denial for one the reader cannot hold, and switching through the leave guard.
- At most 6 tabs; past that, split into groups, never an overflow menu.
- A tab with its own URL search state gets its own route; otherwise one route and a tab parameter.
- Nest a tab set one level down only where a view holds several independent bodies of work.

## Also
- [Head tabs](head-tabs.md)
- [Landing](landing.md)
