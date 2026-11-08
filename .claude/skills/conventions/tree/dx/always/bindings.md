---
id: dx/always/bindings
kind: rule
status: settled
---
# Bindings

- Rename a destructured prop whose clean name is taken in scope as `prop_<name>` (`onChange: prop_onChange`).
- Use a bare leading underscore only for an unused binding.
- Name a hook's result for what it is and read through that name.
- Never destructure a custom hook's result (a query, a mutation, a context hook, a modal control); a library hook and a raw `useContext` read are outside this rule.
  Why: destructuring drops the owner from every later mention.
- Reading one value at its point of use is not destructuring.
- Destructure for an effect dependency only as a last resort; first remove the effect ([effects](../view/effects.md)).
- `const { t } = useCopy()` is the one named exemption, by name only.
- Group sibling hook results under one object literal keyed by role.
