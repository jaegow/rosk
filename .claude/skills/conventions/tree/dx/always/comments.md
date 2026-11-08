---
id: dx/always/comments
kind: rule
status: settled
---
# Comments

CRITICAL: source files (`.ts`, `.tsx`, `.js`, `.css`) carry no comments, test files included.
Carry intent in names, types, the shape of the code and test titles; carry history in the commit and the PR.

Exactly two comment shapes are allowed:
- A lint or type directive the code genuinely requires, alone on its line.
- One line at a site that departs from a settled node as a one-off: `DIVERGENCE: <node id>: <why>`, matching the DIVERGENCE row in the PR.

- If you want to explain a why, rename, extract a named type, add a test whose title states it, or put it in the PR.
- A convention that spans files belongs in this tree, never in a comment.
- `@ts-expect-error` swallows whatever error the next line has, not the one you meant: verify it by deleting it and reading what the type checker reports.
- Delete commented-out code, `TODO`s and file-header blocks on sight.
- A code block in a skill file tags each teaching comment `DOC:` so it is never copied into source.
