---
id: ux/access/control
kind: rule
status: settled
---
# Control

- Show a control the reader lacks the capability for, clickable, in the muted can't-run look; its press toasts who can act and does nothing else.
- Show a group's inputs only to a reader who can use them; others see its CTA alone.
- Where a read lists per-record actions, show only those, with no message for an absent one.
- Hide a listed action only when the record has moved past it for good; keep every other refused action in place, its press toasting the reason.
- Where a read lists no actions, add no client gating by state: the server's refusal, toasted, is the answer.
- If the capability does not resolve before first paint, gate the subtree on the load so nothing flashes.

## Also
- [Never disabled](../shared/never-disabled.md)
