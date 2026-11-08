---
id: ux/feedback/flow
kind: rule
status: settled
---
# Flow messages

- A multi-step flow reports each save trigger's outcome in context as well as a toast: on its step, or across the flow.
- A flow on a saved record checks every step on arrival; a flow creating one checks fields as they are left.
- Each step head shows its own issues marker, or the error glyph; only the step draws a line down its side.
- Each commit's issues marker lists what its press would refuse on, and the whole flow's list sits on a control always on screen.
- A commit that refuses opens its own list on press.

## Also
- [Never disabled](../shared/never-disabled.md)
