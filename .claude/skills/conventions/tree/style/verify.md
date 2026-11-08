---
id: style/verify
kind: rule
status: settled
---
# Verifying a claim

Settle what a class does from compiled CSS, never intuition.

- What a class emits: compile it with the Tailwind CLI against `src/style/theme.css`, in a clean directory inside the project.
- Whether two colours match: rasterize both through a 1x1 canvas and compare bytes; serialized strings differ for identical paint.
- Whether a token reacts to the mode: read the compiled CSS; a computed style reports a resolved literal.
- A browser test reading a computed style without mounting the app imports `theme.css`, and asserts one absolute value beside any old-equals-new comparison.
