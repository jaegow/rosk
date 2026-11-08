---
id: dx/always/compose
kind: rule
status: settled
---
# Compose, never rewrite

- Build from the repo's own components and hooks; never rewrite what one already does.
- The component set is what `src/design-system/index.ts` exports; extend a piece there, never fork it locally.
- A piece joins the set only if it renders on its own; app plumbing that needs app state (the signed-in user, the shell) stays shared app code.
  Why: the gallery renders each member with no app around it.
- Find the set piece before drawing one by hand: a menu row, a status tag (`Chip`), a count (`CountBadge`), the state line down a box's side (`SideIndicator`).
- A box that draws its own `SideIndicator` provides that fact through context, and a row inside reads it and draws none; never a prop to drop the line at the call site.
- Copying a feature view into each page that needs it differently is not a fork when the copies compose the same set pieces ([vertical slice](../page/vertical-slice.md)).

Why: a rewrite is a second copy of one decision, and the copies drift apart silently.
