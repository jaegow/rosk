---
id: dx/view/order
kind: rule
status: settled
---
# Declaration order

Declare a body's bindings in this order: hooks (most used first, then query and service hooks), `useState`, derived values, `useRef`, and `useEffect` last.
