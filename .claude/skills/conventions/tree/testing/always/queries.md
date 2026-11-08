---
id: testing/always/queries
kind: rule
status: settled
---
# Queries

- Find an element by role and accessible name (`getByRole('button', { name: 'Save' })`); fall back to label, then text. Never a class, a `data-slot` string or `querySelector` in a test body.
  Why: a role-and-name query is also an accessibility assertion.
- Read a set piece through its shared `ui_<name>` harness: called with the accessible name (or label) it locates by role, it returns that locator plus the reads and actions the case needs. Extend or create the harness when it lacks one; keep a browser and a jsdom variant where both layers read the piece.
- A harness reads only what the piece publishes (roles, names, `aria-*`, `data-*`), waits for what it reads, and has its own test.
- A layout-contract case that needs a box with no role locates it with the slot locator keyed by the piece's slot constant, never a test id.
- Scope a query to the narrowest container where structure repeats, and so a text matches one element.
- Read a page through one `getViewItems()` the test file defines, with one lazy getter per category (`cta`, `copy`, `form`, `nav`, `dialog`, `toast`, `layout`); `layout` exists only in component tests.
- Read a portalled surface (dialog, popover, toast) from the document, never from the render container.
