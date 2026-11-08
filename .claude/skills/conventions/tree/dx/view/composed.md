---
id: dx/view/composed
kind: rule
status: settled
---
# Shared components over composables

A shared component that fills composable parts (a confirm dialog over `Modal`) takes configuration shaped like those parts.

- One prop per part (`head`, `content`, `foot`), one key per member inside it.
- A member written as a run of children is an array of config objects, each the props of one child.
- A CTA is the CTA's own props under its lane's key; no `submitLabel` translated into it.
- A foot that ranks CTAs by lane takes them this way, never as children, because a CTA bar ranks only its direct lane children.
- A default applies only where the key is absent, so a key written `undefined` never blanks it.
