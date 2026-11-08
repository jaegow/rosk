---
id: dx/view/mutations
kind: rule
status: settled
---
# Mutations

- Call `mutate` with `onSuccess`/`onError`; never `mutateAsync` or a chained promise, except to sequence operations that must happen together, inside `try`/`catch`.
- `mutate`'s callbacks run only while the caller is mounted and for its latest call: put the mutation in the component its outcome belongs to, and give each row action its own row's mutation.
- Report a save's or destructive action's outcome from the callbacks the mutation is created with, which outlive the view; keep view-only follow-ups in `mutate`'s.
- Pass `isPending` to the pressed control's `loading`, plus any wait the view holds after the response; when controls share one wait, only the one that started it shows loading.
- Close a confirm dialog from the callbacks of the `mutate` it starts.
- Send every error to one service-error handler, built with the first service that needs it; never branch on a status code at the call site.
