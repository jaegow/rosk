---
id: ux/record/place
kind: rule
status: settled
---
# The record view

A record view edits one entity.

- Put everything the user can edit about it on one page, in one form, grouped into titled sections.
- Keep it always in edit mode, with no view/edit toggle.
- Show a value the reader cannot change as a read-only field in its group, never bare text, saying why when not obvious.
- Show created and updated times once, at the end of the footer's message band.
- List nested entities in a [field section](field-section.md), never a card.
- An entity moved only by lifecycle actions gets the same view with every value read-only, its actions in the footer and no Save.
- Put a history last, as a table section.
- Show only what the user needs to work the entity; no second copy of a value the form shows.
- Show a field the record's kind always has, even empty; hide one only when it does not apply to this kind; a field another control switches off turns read-only, never hidden.

## Also
- [Frame](frame.md)
- [Read-only](read-only.md)
- [After a lifecycle action](after-lifecycle.md)
- [Instant commit](../instant-commit.md)
- [Nested entity](../nested.md)
- [Dirty](../dirty.md)
- [Field choice](../field.md)
