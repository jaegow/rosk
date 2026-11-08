---
id: ux/feedback/message/field
kind: rule
status: settled
---
# Field message

- A message about one field's value (its error, where it came from) goes under that field, through the one shared field message.
- A field reserves one message line under it: its error while it has one, else its short helper text, else empty.
- What a field is for, past what fits that line, goes in its [info](info.md), never a second line beside it; never an info that restates the label.
- What holds for every field in a section goes in the section head's info; what the commit will do goes in the [footer band](footer-band.md).
