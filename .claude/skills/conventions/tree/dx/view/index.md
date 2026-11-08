---
id: dx/view
kind: rule
status: settled
---
# View

Apply these to every component body.

- It holds a `useForm` → [form](form.md); a multi-step flow → [flow](flow.md).
- It calls a mutation → [mutations](mutations.md); a lifecycle action beside a form → [lifecycle](lifecycle.md).
- It opens a `Modal` → [modal](modal.md); it is worth reviewing on its own → [presentational](presentational.md).
- It raises a status or a foot message → [head status](head-status.md).
- It is a shared component filling composable parts → [composed](composed.md).
- It renders a `Table`, or a control in a table cell → [table](table.md).
- It writes its position into the URL, or focuses or scrolls after a move → [navigation](navigation.md).
- It publishes props for how it paints → [variant](variant.md).
- It renders onto a caller's element, or wraps a Radix trigger → [slot](slot.md).
- It creates a React context → [context](context.md).
- It lays out content inside a `Card` → [page layout](../page/layout.md).

## Also
- [Order](order.md)
- [Effects](effects.md)
- [Refs](refs.md)
- [Imports and exports](exports.md)
