---
id: dx/view/exports
kind: rule
status: settled
---
# Imports and exports

- Write one import statement per module; mark a type-only name `type` inline (`import { Item, type ItemProps }`), and use `import type` or `export type` when every name is a type.
- Use named exports in one `export { ... }` block at the bottom, with types in one `export type { ... }` beside it; a default export only where a tool requires it ([lazy default](../page/lazy-default.md)).
- Export from a component module only what Fast Refresh can swap: a component, an object whose every value is a component, or a literal or imported binding.
- Put anything else in a sibling module and import it from there everywhere: a hook in `use<Name>.ts`, a helper or value in `<name>.util.ts`, a `data-slot` map in `<name>Slot.ts`. Never re-export it from the component module.
  Why: one failing export makes every edit re-run the module and all its importers, discarding page state.
