---
id: dx/always/cta-names
kind: rule
status: settled
---
# CTA names

Call a control a user presses a CTA in every name the code gives it, never `Action`, `Button` or `Trigger`.

- This covers a component, its props type and `displayName`; a prop, slot key, state or ref holding controls; a `data-slot` or test id marking one; and a function or test helper that finds one.
- Name the control in the singular: `CTA`, `<Owner>.CTA` (`Modal.Foot.CTA`), `<Owner>CTA`, and `-cta` in a `data-slot`.
- The one component that ranks CTAs into lanes is `CTABar`, its member `CTABar.CTA`, its lane type `CTALane`.
- Name any other place holding CTAs by position and the plural: `<position>CTAs`, `-ctas` in a `data-slot`.
- Name a container whose job is something else (a toolbar, a filter bar) for that job.
- Write `cta` lower case at the start of a camelCase name and in a `data-slot`, `CTA` in capitals elsewhere (`footCTAs`).
- Keep these words: a library's own part names and wrappers that keep them (`Tooltip.Trigger`, `Popover.Trigger`, `DropdownMenu.Trigger`, `Tabs.Trigger`); what a CTA does (`action: 'edit'`); a record's domain actions; ARIA's `button` role and the native element; copy keys under `common.actions.*`.

Why: one word for one kind of piece lets a name alone say whether two pieces hold the same kind of control.
