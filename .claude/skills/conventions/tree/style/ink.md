---
id: style/ink
kind: rule
status: settled
---
# Ink and surface

Every token is valid alone; the defect shows only where a call site pairs ink with surface.

- Ink comes from the `stress` ladder: bare `stress` is full ink, `stress-xs` to `stress-xxl` are that strength toward the ink, `-inverse` the same strength toward the page.
- Keep `stress-hover`, `stress-selected`, `stress-outline` and `stress-disabled` for those states only; `stress-hover` is a surface wash, never an ink.
- CRITICAL: never use a status hue as text; every raw hue fails contrast as text, on the page and on its own tint.
- Read a label on a hue fill from the ladder; carry a field's state on `border-<hue>` and keep its label and helper on the ladder.
- Border a tinted hue fill with the raw hue, never the hue's tint, which matches the fill and draws nothing.
- When `cn()` picks a surface conditionally, name the ink in every arm.
- An icon inherits its host's colour; give it its own only as a deliberate accent, and set a colour every child shares on the host.
