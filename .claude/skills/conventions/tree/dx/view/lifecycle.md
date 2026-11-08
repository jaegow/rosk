---
id: dx/view/lifecycle
kind: rule
status: open
provisional: The modal ships no submitting state; behind a confirm, pass pending to the confirm's commit CTA as loading until it does.
---
# Lifecycle action beside a form

A lifecycle action moves the saved record's state through its own endpoint.

- Make it its own `mutate`, sending only its own payload; never send or reset form values.
- If it acts on saved values the form edits, refuse on press while any is unsaved: return early with a warning toast naming what to save first, before any confirm. Keep it clickable.
- On a press while pending, toast that it is still running; Save toasts the same while any lifecycle mutation is pending.
- On success, `rebase(values, { keepEdits: true })` only the properties it changed.
- Behind a confirm dialog, pass pending to the dialog's submitting state and close it in `onSuccess`.

## Also
- [Mutations](mutations.md)
