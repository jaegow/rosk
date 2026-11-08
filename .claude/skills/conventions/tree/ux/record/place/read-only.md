---
id: ux/record/place/read-only
kind: rule
status: settled
---
# Read-only

- A reader who cannot write gets the same view with fields read-only.
- Decide what is shown or read-only once, at the page root, from the access answer, and pass it down.
- A page with nothing editable for this reader right now keeps its footer, marked read-only with "View only" and, when permission is why, who can change it, in one line.
- A partly editable page keeps its normal footer.
- A surface whose purpose is acting on an item is outside this rule.
