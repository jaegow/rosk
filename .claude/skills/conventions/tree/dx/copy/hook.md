---
id: dx/copy/hook
kind: rule
status: settled
---
# Copy hook

- Use a hook returning resolved strings only where a `string` is required and no component can fit.
- Shape it as a lookup of one literal `t(...)` per key, indexed by the data value.
- Check the prop's type first: if the slot accepts `ReactNode`, use the component.
- Never export a key instead of the string.

## Also
- [Keys](keys.md)
