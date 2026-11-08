---
id: dx/view/flow
kind: rule
status: settled
---
# Multi-step flow

CRITICAL: every step and sub-step is its own `useForm` following every form rule; a flow is never one form narrowed to the step on screen.

- One coordinator references each step's form and never copies its values; it owns the current step (in the URL), which steps are required and depend on which, cross-step checks, each step's status and whether any step is dirty.
- A read across steps reads the other form's current values through the coordinator.
- A dependent clear is a draft write into the dependent step's form.
- A step's primary validates its form, then runs its own commit or only confirms the step; its commit decides where the flow goes next.
- A step's save sends only its form, rebases it, and rebases siblings keeping their edits; a backend that takes only the whole record gets one submit built from every step, and field errors return to the step that owns each field.
- The coordinator opens the commit window on every step form for the length of a commit.
- A step's Cancel reverts only that step.
- Steps stay mounted while closed, so a draft survives a step move.

## Also
- [Form](form.md)
