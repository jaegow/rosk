---
id: dx/copy/helper
kind: rule
status: settled
---
# Module-level copy helper

- A `t`-taking helper may sit at module level in a `.tsx` only while it is not exported and the file exports the component that consumes it.
- If either stops holding, turn it into a [copy component](component.md) or a [hook](hook.md).

## Also
- [Keys](keys.md)
