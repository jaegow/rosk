---
id: ux/record/instant-commit
kind: rule
status: open
provisional: A field or link edit waits for the record's Save; a child record or a lifecycle action saves on its own; review each control that saves on its own against layout shift before building it.
---
# Instant commit

Which controls in a record editor save on their own?

- A field edit or a link edit (a relation list) changes only the draft; Save commits it, Cancel discards it.
- A child record or a lifecycle action saves on its own; a lifecycle action refuses while edits it reads are unsaved ([after a lifecycle action](place/after-lifecycle.md)).
- A control that commits on change is never a field of a record that has a Save.
