---
id: dx/view/variant
kind: rule
status: settled
---
# One appearance axis

- Name how a component paints on one `variant` prop, resolved through a typed map; never a second appearance prop beside it, above all a `color`.
  Why: two "how loud" props multiply into combinations nobody designed.
- Group like options into one object prop (an icon's start and end), never sibling props.
- A density on the shared scale (`sm`, `md`) may sit beside `variant`: it is layout, not appearance.
