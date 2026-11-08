---
id: dx/page/vertical-slice
kind: rule
status: settled
---
# Vertical slice

- Keep a `.page.tsx` in one file whose root owns every branch: no sibling file for its fields, sections or dialogs.
- Make the default export the last declaration and the only part that decides what the reader gets; order everything above it leaves-first.
- Read access for the page's own route at the root and hand it to the page gate; render denial as the gate's state, never an early return, and never hold reads back on access.
- An access check answers a state, never a boolean: compare it to the state you need.
- A check that does not deny the page passes down as a prop (read-only is a prop, denial is a branch).
- For a record page: the root reads the route and decides create from edit; report the record read's loading and failed first read on the gate; mount the editing arm only once the record exists, keyed on its id; name arms `<Domain><Mode>Arm` and fields `<Domain><Mode>Fields`.
- Only these live in their own files: a set piece; a view rendered the same way under two or more routed pages; domain infrastructure (`<domain>.type.ts`, `.service.ts`, `.util.ts`, `use<Domain>.ts`, any hook); a [presentational](../view/presentational.md) view.
- When two pages need a shared view to differ, each keeps its own copy composed from the set; never a flag, mode or variant for one caller.
