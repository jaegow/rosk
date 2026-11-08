---
id: ux/feedback/result
kind: rule
status: settled
---
# Result

- CRITICAL: show every outcome a submit or mutation returns.
- A field-keyed error shows on its field; every other failure is an `error` toast through the one service-error handler, naming the fix for a fixable refusal and retry for a server failure.
- Server text never reaches a toast: use our copy, chosen by the server's error code where one is sent.
- A response asking the user to confirm or choose before their action can finish is a [modal](message/modal.md), in our copy.
- Show a success through the commit itself: its loading, then the changed view where the user acted.
- Toast a success only when nothing on screen shows it: background work, a per-item bulk result, an effect off screen, a value the server decided, or a success carrying Undo or View.
- Show an invalid submit's errors on the fields only, and never hide a field that may need to show one.
- On a failed save keep every edit and leave the form dirty.
- Report an outcome that lands after the reader left only for a save or a destructive action.
- If access denies before the user acts, show it on the page, never a toast.

## Also
- [Toast](toast.md)
