---
id: ux/action/commit
kind: rule
status: settled
---
# Commit

- Place a commit only at the bottom of the view or in a modal footer; in a multi-step flow, each step's commit sits in its own step footer.
- The page footer holds only what acts on the whole record.
- Only an inline add-row commits on Enter; a modified shortcut (ctrl/meta+S) may press a footer action when its info names the shortcut; never a bare or alt letter.
- Give every footer action one fixed lane in every state: occasional actions tertiary, the closers secondary and primary.
- Save is `primary` in the primary lane in every state and footer; Cancel is `secondary` in the secondary lane.
- A lifecycle step (Submit) sits right of Save in the primary lane, `secondary` beside a Save, `primary` where the footer has none.
- Negative actions (Delete, Reject) sit leftmost, at the start of the tertiary lane, as `danger`.
- A modal's or prompt's commit is `primary` even when it deletes; its label or info says so.
- Never change a CTA's variant or lane with state; a toggle showing its own on state is the one exception.
- If access hides an action, move nothing into the gap; if the record's state hides one for good, close up its lane.
- A page shows a way back to its parent only when it opts in, first in its footer's message band.
- No optimistic update: the pressed control shows loading until the server answers.

## Also
- [Never disabled](../shared/never-disabled.md)
- [Primary is reserved](../shared/primary-reserved.md)
- [Destructive](destructive.md)
