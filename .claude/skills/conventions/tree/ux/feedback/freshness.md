---
id: ux/feedback/freshness
kind: rule
status: settled
---
# Freshness

- Give a view server push when its records' topic publishes change events: subscribe only while open, refresh everything on reconnect.
- Keep a poll beside push only for fields no event announces.
- Stop a poll once its data reaches a terminal state, and never poll from a hidden tab.
- With no push, refetch after the reader's own writes and when the tab regains focus.
- A list shows pushed changes in its rows alone, with no notice; a dirty form under an update raises the updated-elsewhere warning.
