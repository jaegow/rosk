---
id: dx/view/presentational
kind: rule
status: settled
---
# Presentational views

A domain view worth reviewing on its own, a dialog first, has a presentational version.

- It takes everything as props: values, each request's state (`loading`, `submitting`, refusal messages) and one callback per user action.
- It calls no service, query or mutation hook and reads no route.
- It lives beside the page that wires it, and has a gallery page rendering it on invented fixture data once per state worth reviewing.
- It takes data, never a flag that changes what it renders for one caller.
