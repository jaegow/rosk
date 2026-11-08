---
id: dx/view/form
kind: rule
status: settled
---
# Form

Two or more related fields, or any validation, is a `useForm` with a schema resolver; a lone search box or toggle may be component state.

## Model
- The form holds a model, not the record: map record to model for the baseline and every rebase, and model to payload explicitly; never send `values` as they are.
- A formatted field (a date, an amount) holds its shown text; map to and from the wire format through one shared mapper, and check it with the same parser the payload uses.
- `defaultValues` are a plain object.

## Baseline
CRITICAL: `defaultValues` are always the last saved values, or a create's blank plus its fixed defaults (values the same at every open, such as today's date). Never a draft, another form's values or a guess.
A view never calls `reset` or `resetField`; each move is one store method:
- `revert(names?)`: the draft returns to the baseline (Cancel, a confirmed discard).
- `rebase(values)`: baseline and draft become `values`, after this form's own save.
- `rebase(values, { keepEdits: true })`: the baseline moves, edited fields keep their edits (a sibling's save, a lifecycle action).
- `unsubmit()`: after a failed save, keeping draft, dirt and errors.
- `setValue(name, value, { shouldDirty: true })`: a draft write (a dependent clear, a prefill); the baseline never moves.

## Someone else's change
- A clean form re-seeds when the saved record changes; a dirty one raises the updated-elsewhere warning. A view adds no sync of its own.
- Seed from the record the view watches, never a stale copy such as a list row.
- CRITICAL: a save opens the form's commit window before it sends and closes it when it settles; inside it, the record moving is the user's own save, taken silently.

## Saving
- Order: guards (each toasts and returns), the no-changes check (skipped on a create), `submit()` returning unless valid, then `mutate`.
- Success rebases on the response; failure goes to the shared service-error handler with the form, which unsubmits and pins field-keyed errors, passing only codes the field message knows and the generic invalid outcome for any other. A view never calls `setError` for a server error.

## Fields
- A field never takes a react-hook-form `ref` or spreads `register`; it binds through the shared field hook, and focus moves to a field by its id.

## Layout
- A form root states its layout, `col-1` or `col-2`; how many is the ux frame's call.
- The form foot takes its CTAs as lane props (primary, secondary, tertiary) and a message, never as child CTAs: its CTA bar ranks only its own direct lane children, so a child written inside a wrapper would escape the ranking.

## Also
- [Leaving a dirty record](../../ux/record/dirty.md)
- [Mutations](mutations.md)
- [Effects](effects.md)
