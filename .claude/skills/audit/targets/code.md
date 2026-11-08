# Audit the code against the conventions

Run only when asked for a sweep of the app against the tree. Research only: it writes findings, never code.

1. Map each sitemap route to its page, its feature folder and the set pieces it renders.
2. Split the routes into batches that each fit one context; fork one per batch, each walking the conventions tree for every page it holds.
3. A divergence is code that departs from a settled node; record a GAP or OPEN call as a question, never a divergence. The gallery's own chrome is outside the tree.
4. Each fork writes, per route: `No divergences.`, or rows of `Node | What the code does (file, symbol) | What the node says | Proposed change | Shared piece or - | Size`.
5. Merge the batches, collapse each shared cause into one proposal on the shared piece, and order bugs first, then the fixes that reach the most views.
6. For each shared cause, propose the hardening that would have prevented it: a default that equals the rule, a narrower prop type, or a guard test.
7. Write the result to one dated `*.scratch.audit.*` folder at the project root and report it; fixes ship only on a yes, one PR per cause.
