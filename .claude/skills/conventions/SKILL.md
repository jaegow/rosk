---
name: conventions
description: Use before writing, reviewing or planning any code, test, style, copy or user-facing behaviour in this repo. Walks one decision tree (dx, ux, testing, style branches) that settles each choice or flags it.
---

# Conventions

Every convention this repo has chosen lives in `tree/`, one decision per file, and the tree is its single source of truth.

## Walk

1. Read `tree/index.md`. For each branch the work touches, read every Always leaf, then open its roots.
2. At a question node, answer once per thing the work adds there; choose from the bullet text alone and follow exactly one branch. No bullet fits: that is a GAP, take `default`. Never open a sibling.
3. At a rule node, apply it, then read every link under its `## Also`, once per walk. Read other links only when needed.
4. Record one row per node that decides something: node id, decision, status.

## Status

- settled: the node decided it.
- GAP: no branch fit; its `default` was taken.
- OPEN / CONFLICT: the node is not settled; apply its `provisional`, or an approved plan's answer named in the Note, and keep the status.
- DIVERGENCE: a one-off departure from a settled node.
- RULING: the work changes a settled node into a new rule.

## When the work contradicts a settled node

CRITICAL: in an interactive session, after the walk, ask one question on its own: a one-off, or a new rule?
One-off: record DIVERGENCE and mark the code site with the one-line `DIVERGENCE` comment `dx/always/comments` allows.
New rule: record RULING and edit the node in this session, in its own PR unless the edit depends on the work's code.
Working unattended from an approved plan: ask nothing, depart only where the plan holds a DIVERGENCE or RULING row, and build what a settled node says over the plan's prose.

## Output

In a plan, write `## Decisions` with one table `Node | Decision | Status | Note`, one node id per row, never in a fence. With no rows, write `None.` and why.
Copy every row that is not settled into the PR description under `Divergences`.

**REQUIRED SUB-SKILL:** use `skill-memory` when you learn something new or before relying on a `memory.md` finding.
