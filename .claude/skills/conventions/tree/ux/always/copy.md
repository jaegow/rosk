---
id: ux/always/copy
kind: rule
status: settled
---
# Copy

- Take every user-facing word from the translation layer, and store exactly what the user sees: never change case with a style or a string transform.
- Title Case for labels (buttons, field labels, column headers, tabs, nav rows, menu items, chips, titles and headings), short prepositions lowercase; sentence case for messages, helper text, empty states and toast bodies. Acronyms stay uppercase.
- Never show a server identifier or enum as copy, or through a string transform; map it, and render a value with no mapping raw until its key is added, so it is visibly wrong.
- Render an unrecognised status raw on a neutral fill, never as an error or a blank.
- One exception: a server's field error with a code the client has no copy for shows the generic field error, since the reader must still act on the field.
- Render user-authored content as typed.
- Show a read value as a labelled value, never interpolated into a sentence.
- Give a property one label everywhere it appears.
- Give each sentence one key; keep separators in the layout; name an interpolation `count` only for a real plural.
- Say what a reader cannot do, and who can, in the words of their work, never a permission's name.
- Show dates, times, numbers and amounts through the one locale-bound formatter; an absent value is the em dash; a recent event may read relative.
- Gallery specimen text is literal; no product view takes that exception.
