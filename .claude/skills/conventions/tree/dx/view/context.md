---
id: dx/view/context
kind: rule
status: settled
---
# Context

- Create every context with `createStableContext`, never `createContext`.
- Pass `import.meta.hot` itself as the first argument, and a module-level const's name as the key, unique in its module.

Why: a hot update re-runs the module, and a fresh `createContext` strands every mounted consumer from its provider. The helper keeps the first object, so a changed default applies only after a full reload.
