---
id: ux/surface/page-actions
kind: rule
status: settled
---
# Page actions

- Page-level actions that do not commit (New, Upload, Export) sit in the primary lane of the page footer; a page whose form has its own footer puts them there, never a second bar.
- A view mounted inside another page or a modal keeps its create in its own toolbar.
- A control changing how one column of a view shows sits at that column's top, trailing edge.
- A commit or lifecycle action is never a page action.

## Also
- [Primary is reserved](../shared/primary-reserved.md)
