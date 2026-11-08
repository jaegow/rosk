---
id: style/classes
kind: rule
status: settled
---
# Classes

- Write a utility class inline in the `className` or `cn(...)` of the element it styles; never in a shared or local const.
  Why: `cn`'s merge sees only literals, and a shared class couples two components through a detail.
- Elements that must stay in lockstep share a component or a token, never a class string.
- Write `style` only for a value known at render (a prop, a measurement, a library's transform).
- Write a constant, or a choice among constants, as a class named per arm in `cn(...)`, custom properties and arbitrary values included; never carry a token as data in a config handed to `style`.
- Set a custom property inline only when the value must reach a variant, a pseudo-element or a descendant.
- Give a third-party component `className` when it takes one.
- Clip a box that collapses or animates its size with `overflow-clip`; keep `overflow-hidden` where content can overflow at rest or a scroller must keep its offset.
- `text-box` trim centres glyph ink only on the element that holds the text; it does not inherit, so on a flex parent it does nothing.
