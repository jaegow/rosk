---
id: ux/action/destructive
kind: rule
status: settled
---
# Destructive

- Confirm an action in a modal before it runs when it loses something saved that one action cannot bring back.
- Removing an unsaved row or unlinking something re-addable in one step is not destructive; confirm neither.
- Also confirm a reversible action whose effect lands on someone else at once, naming who; its undo runs unconfirmed.
- Confirm deleting a record as a state of its [detail modal](../record/step.md), never a second modal.
