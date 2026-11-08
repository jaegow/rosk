---
id: dx/page/lazy-default
kind: rule
status: settled
---
# Lazy default

- A lazy-loaded page module exports its default and nothing else.
  Why: a named export invites an eager import that pulls the module into the main bundle unseen.
- A value a page must share moves to its own module.
