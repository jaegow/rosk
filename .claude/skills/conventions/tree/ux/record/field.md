---
id: ux/record/field
kind: rule
status: open
provisional: The form set ships text, text area, date, select, radio, checkbox and switch fields; until a segmented control, autocomplete, inline picker or multi-pick is built, use radios for a few peer options and a select for a pick from a set, and apply the clear rule as written.
---
# Field choice

- A few peer options: a segmented control; a vertical list: radios; in a form table's row: a select.
- A setting that takes effect as toggled: a switch; a selection being collected: a checkbox.
- Pick one nameable record from a set typing narrows: an autocomplete; telling candidates apart needs more than a name: an inline picker; a search field filters a list and never sets a form field.
- Commit an autocomplete's typed text only through its create row, never on blur or Enter.
- A multi-pick shows at most two picks in the field, then one "…more" chip; the dropdown lists every pick with its remove.
- A single-line text-like field and a date field draw one clear inside the box, only while they hold a value the reader may change; a choice field (select, radio, checkbox, switch) and a multi-line field draw none.

## Also
- [Dependent reset](dependent-reset.md)
