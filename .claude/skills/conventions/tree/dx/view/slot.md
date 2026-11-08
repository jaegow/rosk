---
id: dx/view/slot
kind: rule
status: settled
---
# Slot and triggers

- A component that can render onto a caller's element (`asChild`) supplies a button-only attribute (`type`) only when it renders a button, and cancels one a wrapped part would inject.
- Forward what the caller passes; never clear a defaulted prop with `undefined`, which a destructuring default also fills.
- A wrapper around a Radix trigger sets its `data-slot` only when it renders its own element; under `asChild` it sets none, or it overrides the child's own slot.
- A content or anchor part slotted over a panel keeps its name.
