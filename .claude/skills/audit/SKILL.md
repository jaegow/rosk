---
name: audit
description: Use only when explicitly asked to audit, sweep, prune or tidy something in this repo: a skill, the code against the conventions, comments, the test suite, the app's views, or local state (scratch files, branches, worktrees).
---

# Audit

Run `audit <target> [path]`; a path narrows the run where the target allows.
The procedure for each target lives in `targets/<target>.md`, its sole source: `skill`, `code`, `comments`, `tests`, `views`, `local`.
If no target fits, stop and write one with the user, shaped to what is audited; never guess a procedure.

## Rules for every target

- CRITICAL: the live code is the source of truth. A rule that disagrees with it is stale or has found a bug; say which, with proof.
- Prove every "unused", "no caller" or "covered elsewhere" claim with the command or the quoted title beside it; search with `rg`, never `git grep -E`, which ignores `\b`.
- A convention a tool already rejects is a deletion candidate; prove the coverage by writing the smallest violating file, running `npm run lint` and `npm run lint.types`, then deleting it. Never infer coverage.
- Fork a batch that would dominate context when read inline; a fork reports deltas only, never file contents.
- Prompt per finding before deleting or moving a rule; never unilaterally.
- Edit forward: never run `git checkout --`, `git restore`, `git reset --hard`, `git clean` or `git stash drop`.
- Never read `.claude/settings.local.json`.
- A clean run writes nothing: "no findings" is not a finding.

**REQUIRED SUB-SKILL:** use `conventions` for the `code`, `comments` and `views` targets.

## Output

Each target says where its findings go. Unless it says otherwise, report two lists: fixed (file and symbol, what changed) and discuss-first (what is wrong, why it is not a direct fix), then ask.

**REQUIRED SUB-SKILL:** use `skill-memory` when a target writes to a `memory.md`.
