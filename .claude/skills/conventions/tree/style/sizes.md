---
id: style/sizes
kind: rule
status: settled
---
# Sizes

- Write sizes in rem: dimensions, spacing, gaps, offsets, tracks and type. Never a size in px.
- Write graphical treatments in px: border, ring and outline widths, a 1px rule, radii, shadows.
- Give border, ring and outline widths only these steps: the bare utility for 1px (`border`, `border-b`, `ring`, `outline`), or `-0`, `-2` or `-3` (`border-0`, `border-s-3`, `ring-2`); never a wider step or an arbitrary value.
- Our components take size props in rem; a third-party API that takes only pixels gets rem converted from the live root font size through one shared converter.
- Read the theme's `--spacing` and root size before porting a value from a design: a numeric step does not mean the stock pixel value.
