---
id: dx/view/effects
kind: rule
status: settled
---
# Effects

- Avoid `useEffect` in a view: derive on read, or move the sync into the hook that owns the data.
- An unavoidable effect sits at the bottom of the body, above the return.
- Cancel every timer or animation frame a component starts when it unmounts, and drop work still waiting on a promise once it has; left running, it fires into whatever renders next.
