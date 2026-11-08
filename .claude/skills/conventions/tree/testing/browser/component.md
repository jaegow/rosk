---
id: testing/browser/component
kind: rule
status: settled
---
# Browser component test

- Mount the component alone, with `theme.css` imported, never the app.
- Its own test may assert its layout contract (an inset, an overlap, a truncation, a stacking order) when that contract is the piece's job; measure a block-level child, never the padded element or an inline span.
- Keep one case per real behaviour.
- Read paint only where the piece publishes it as data (a CTA's `data-cta-variant`), never a class.

## Also
- [Assertions](assertions.md)
- [Stability](stability.md)
