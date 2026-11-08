---
id: ux/shared/never-disabled
kind: rule
status: settled
---
# Never disabled

- CRITICAL: the base CTA has no `disabled` prop; a control that cannot act right now is `unavailable`: `aria-disabled`, still focusable, its press swallowed or explained.
- A control that changes data explains: its press toasts the specific reason, or opens a dialog for a decision.
- Explain at the click the user made, not after they filled a form.
- A control that only moves the view (paging, a tab, a sort) may swallow its press at its boundary; an unavailable tab stays focusable and never opens its panel.
- A menu item that cannot run is unavailable, never disabled: it stays reachable and its press explains.
- Save is never inert: on a clean edit it looks unavailable and its press toasts that there is nothing to save, checked before validation; a create skips that check and validates.
- A refused submit leaves Save looking unavailable until the next edit; its press still runs and shows the errors again.
- Show an invalid submit's errors on the fields, never by blocking the click.
- Give an unavailable control the muted can't-run look and no info saying why; its press says why.
- An action already in flight under a covering overlay needs no guard of its own.

Why: a `disabled` control is a dead end that swallows the pointer and leaves the tab order, so nothing can explain it.

## Also
- [Primary is reserved](primary-reserved.md)
