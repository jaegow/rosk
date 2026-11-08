---
id: ux/feedback/message/header-band
kind: rule
status: open
provisional: The head status host shows only the most urgent status as one band; until folding, context and processing bands are built, raise at most one band-worthy status per view through it.
---
# Header band

- One message about the whole page, modal or card that holds until the record's state changes is its head's status band, under the tabs, full-bleed.
- Every outcome of an action is a toast, never a band.
- Prefer no CTA in a band, and one band per view; a band about one record names it as its title, its facts as points, its time as a labelled time line.
- Fold two or more bands into the lead's with a "more"; count only bands that carry a status. Clip a lone band past three lines.
- Context that is not a status takes a `context` band ranked last; unowned processing takes a `processing` band ranked first.
