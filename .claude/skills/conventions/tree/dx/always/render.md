---
id: dx/always/render
kind: rule
status: settled
---
# Render

- Never write a named function returning JSX inside a component: give it props and a file, or inline it.
- One exemption: a region whose own pending, error, empty and data ladder wraps tens of lines keeps a named `renderBody`; a page needs none.
- Branch inline with an anonymous IIFE holding a `switch`, and duplicate the switch at each site rather than share it.
- Annotate the IIFE's return type whenever the switch covers a union; unannotated, a missing case returns `undefined`, which `ReactNode` accepts.
- Accept duplicated markup and class names over a helper that only saves typing.
- Write 2 to 10 items as plain JSX; `.map` a large or dynamic collection.
- Never reach for `memo`, `useMemo` or `useCallback` for speed: the React Compiler handles it. Use one only where identity is the behaviour.
