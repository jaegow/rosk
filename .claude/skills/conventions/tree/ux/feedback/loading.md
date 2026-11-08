---
id: ux/feedback/loading
kind: rule
status: open
provisional: The page gate has no submitting state and the modal no gate; until they are built, a record's save shows its wait on the pressed CTA alone.
---
# Loading

The loading bar shows only a wait with an end; a state that keeps going without the reader (background work, a poll) is a status with a working mark.

- Always render the page; never early-return or cover the view while a read loads.
- A part that knows the shape of what is coming shows its own loading in its slot (a table in its body, a value as a skeleton its size); any other wait is the owning container's loading bar, on the top edge of its content under the whole head (tabs and status band included), after a short delay so a fast read never flashes it.
- Never draw a skeleton block or a spinner in place of a container's content.
- A status drawn from a read never shows before the read answers.
- The page gate is only for access, a failed read with nothing left to show, and a write in flight; the modal gate likewise.
- A list always renders its filters and table over a failed read; the table says it could not load, the toast carries Retry.
- An async action shows loading on the control the user pressed and holds what its outcome rewrites until the outcome is on screen: a row action holds only its CTA; a section its region; a modal or the page's own record its gate's submitting state, a bar over a still cover.
- Every close of a held container works at any moment and never cancels the work.
- A field that commits on change shows its own busy state until the server answers.
- Mark a list processing only for the reader's own change to its query; a background refresh replaces rows in place silently.
- If some of many records fail, show the rest and say in the region how many did not, with one Retry; never drop one silently.

## Also
- [Layout shift](../always/layout-shift.md)
