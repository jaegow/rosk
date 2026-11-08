---
id: dx/always/inline-over-hoist
kind: rule
status: settled
---
# Inline over hoist

- Define a value where it is used.
- Hoist only when one of these actually holds: it has more than one real consumer; it must be stable across renders for a concrete reason (identity, a dependency array); it is independent of render, props and locale.
- Inline a helper with one call site at that site, however many lines.
  Why: DRY is about one piece of knowledge in two places, not line count.
- Extract in the diff that adds the second real caller.

## Also
- [Render](render.md)
