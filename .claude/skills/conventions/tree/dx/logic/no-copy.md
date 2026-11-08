---
id: dx/logic/no-copy
kind: rule
status: settled
---
# No copy in logic

- Never put display copy in a module that cannot call a hook (a util, a resolver, a constants file): it can never be translated, and nothing reports it.
- Let the pure module own the decision and return it as a string union outcome, never a copy key.
- Choose where that outcome's words live through [copy](../copy/home.md).
