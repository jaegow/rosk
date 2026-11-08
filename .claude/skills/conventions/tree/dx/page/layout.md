---
id: dx/page/layout
kind: rule
status: settled
---
# Page layout

A page takes its whole layout from `Page` members: `Page.Content`, then a layout member, and only inside it a card, a table or a form.

- Write every `Page` member the page uses in its default export's returned JSX, so that return reads as the page's whole layout; a component the page declares renders only what sits inside a member.
- Write no wrapper element to arrange, space, inset or scroll (no grid, flex, gap, margin, padding, width or overflow class), and no such class on a member.
- A layout no member covers is a gap: add a member to `Page`, never a wrapper in the page.
- Name a member that only sits inside another `Page.<Parent>.<Child>`; give a member's parts as children, never props.
- Pick the content layout by what the page is: `fill` when a table owns the scroller, `flow` when the page scrolls whole, `2-up` for a review beside its evidence.
- Page content is blocks: the content owns the vertical flow and one gap, each block pads itself by the page gutter.
- Anything that spans its container edge to edge (a head's status band, a banner, a table) is full-bleed through one mechanism: the padding container sets `--bleed` to its padding and the spanning piece takes the `full-bleed` utility; never a negative margin of its own.
- A message surface (toast, alert, banner, head status) takes its content as configuration props, never child parts.
- A routed tab view is a page with its own `Page.Content`; its host renders only the tab bar, its gate and a pass-through panel, and lazy-loads each tab's `<Name>.page.tsx`.
- Every form field sits in a `Form.Section`, never loose in content.
- A section title is the section's head part, laid out by it; a view never gives a head its own breakpoint or wrap.
- A history is a table, never a stack of cards.
- An element that carries meaning (a landmark, a live region, a drop target) is not a wrapper; give it no layout class.

Why: a wrapper decides a layout once per page, so sibling pages drift; a member decides it for every page.

## Also
- [Surface frame](../../ux/surface/frame.md)
