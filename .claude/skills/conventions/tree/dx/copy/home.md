---
id: dx/copy/home
kind: question
status: settled
question: Where does this copy get resolved?
default: component.md
---
# Where display copy lives

Display copy stays inside React: a util never takes `t`.
A fixed string written once is an inline literal `t('key')` and takes no branch.
This question is for copy resolved from a value (an enum, a status) or needed as a plain `string`.

- It renders as a JSX child → [component](component.md)
- A `string` is structurally required (`title`, `aria-label`, an option label) → [hook](hook.md)
- Several sites in one `.tsx` need the same `t`-built string and neither fits → [helper](helper.md)

Unsure means component. Every branch follows [keys](keys.md).
