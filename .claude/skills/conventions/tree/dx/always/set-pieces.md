---
id: dx/always/set-pieces
kind: rule
status: settled
---
# Set pieces

Apply these when adding or changing a member of the component set.

- A compound component is `Object.assign(Root, { Part })`; each part sets `data-slot` from the piece's `<name>Slot.ts` constants and a `displayName`.
- The base part enforces what holds everywhere ([never disabled](../../ux/shared/never-disabled.md), an icon-only control has a name); a placement gets a role whose props narrow to it, so a call site decides only words, intent and state.
- A part declares what it holds (a column's kind, a field's state) and the piece derives alignment, truncation and paint from it.
- Make every default equal the settled rule. When the same correction repeats at call sites, flip the default; when a rule forbids a choice, remove the prop.
- Give an unknown value a neutral, readable state: an unknown status renders raw on a neutral fill, a capped read says it was cut, a failed read shows a failed state with Retry, never an empty one. Type it so the fallback is the only path.
- Give each piece of state one owner: access to the page gate, in-flight state to the CTA that started it, a draft to the form store, cache keys to the domain hook.
- No one-off escape hatches: no prop that exists for one caller, no `className` override that repaints a variant.
- A shape rule no type can hold gets a guard test, never prose alone.
