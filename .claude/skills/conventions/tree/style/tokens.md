---
id: style/tokens
kind: rule
status: settled
---
# Tokens

- `src/style/theme.css` is the only token source: read it directly for every token, mode override and custom utility.
- A colour, size or layer with no token gets one there; never a literal at a call site.
- A surface that must cover something already on the modal layer gets its own higher z-index token; portalled surfaces sharing a rung resolve by DOM order, which is wrong whenever the covering one opened first.
- `@theme inline` bakes a token's literal value, alpha included, into every utility at build time, so a mode override of that token never reaches them. A token that differs by mode takes its varying part from a variable the mode sets.
- Every theme block is static, so each token reaches the build whether or not a utility reads it; a token read through raw `var()` needs no utility to survive.
- A mode applies on any element carrying `data-theme`, so a subtree can switch mode; a token derived from other variables resolves where it is declared, so redeclare every derived token (the ladder, the tints) in the scoped block, never only on the root.
- A frame that switches mode paints its own base and ink; nest at most one themed frame inside another, since the `dark:` variant tells a light frame inside a dark one apart but not a third level.
- Request only the font weights the theme ships; another weight silently renders a neighbouring face.
- Every browser the app supports must ship a CSS feature before it is used bare; otherwise give it an `@supports` fallback or skip it.

## Also
- [Verifying a claim](verify.md)
