---
id: ux/feedback/toast
kind: rule
status: settled
---
# Toast

- Raise a toast from a view through the view-owner hook and give it a scope: `component` (the default) leaves when the view that raised it unmounts; `app` survives navigation for work that outlives the view; `required` holds a blocking state tied to nothing on the page, with no close and no timeout, until its CTA is pressed.
- Code with no view to own it raises an `app` toast.
- A failed action's toast is sticky with a close, until dismissed or its view leaves; every other toast keeps the default duration.
- Report background work in one slot: an `info` toast while it runs, replaced in place by its result under the same id.
- One message at most, its facts as short points.
- A toast reporting many records leads with how many each outcome took.
- Label actions with verbs and never colour them at the call site.
