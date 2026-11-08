---
id: dx/view/refs
kind: rule
status: settled
---
# Refs

- Hold a view's related mutable values in one `useRef({ ... })`, read as `ref.current.<name>`.
- Keep a DOM ref passed to `ref={...}` as its own `useRef`; folding it in forces a callback ref that re-runs every render.
