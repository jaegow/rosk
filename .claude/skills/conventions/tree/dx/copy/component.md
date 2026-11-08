---
id: dx/copy/component
kind: rule
status: settled
---
# Copy component

- A value rendered at one site keeps an inline IIFE with one literal `t(...)` per case and an annotated return type ([render](../always/render.md)).
- A value rendered at several sites goes through one shared copy component, the stated exception to duplicating the switch.
- Take inputs as close to the data shape as possible, ideally the row itself.
- Ask the pure resolver which outcome matched ([no copy in logic](../logic/no-copy.md)), then switch to one literal `t(...)` per case.
- Return the string and render no element of its own, so the caller keeps the styling; annotate the return `string` so a missed case fails to compile.
- A table column's label is a literal `t(...)` at the column inside the view, never in a columns module.

## Also
- [Keys](keys.md)
