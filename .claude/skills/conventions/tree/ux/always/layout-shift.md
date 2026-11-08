---
id: ux/always/layout-shift
kind: rule
status: settled
---
# Layout shift

- Never swap a view's content on a click unless the reader loses no context.
- When part of a view changes, the space around it stays still: the part keeps its footprint, or grows in a visible transition.
- When showing more would move what the reader is looking at, open it in a modal instead.
- Never move the control under the pointer or caret: an input keeps its place as its value grows, and a CTA's busy state fits inside its own box.
