---
name: quick-iterate
description: Use when the developer wants a quick feedback loop on a branch, asking for changes one after another and holding lint, tests and validation until they say they are done.
---

# Quick iterate

Make each requested change at once, record it in a ledger, and prove the whole set together at the end.

**REQUIRED SUB-SKILL:** use `conventions` for every change and for the finish.

CRITICAL: run no lint, typecheck, test or `npm run validate` between changes, and push nothing until the final validate passes.

## Start
Work on the named branch; on the base branch with none named, create one.
Create `MM.DD.YY.scratch.ledger.<short-description>.md` at the project root, headed with the branch, `git merge-base HEAD origin/<base>` and the goal.

## Each change
Make it yourself in the conversation, never in a background agent; walk the conventions tree wherever `.claude/rules` asks, and ask one line where it leaves a choice open.
Commit it alone, then append to the ledger: the request in the developer's words; the commit and files; what changed; which entry it supersedes; what it removed or renamed that a test can read (a slot, copy key, prop, helper or visible behaviour); and what the end must prove (the existing case to extend, or "no behaviour change").
Undo with `git revert` and mark the entry reverted.
Answer "does this break anything?" by reading and grepping consumers; run only the covering test files, and only when reading cannot settle it.

## Finish
1. Collapse the ledger into the end state, then walk the testing branch for every behaviour in it.
2. Write `MM.DD.YY.scratch.plan.<short-description>.md`: per behaviour, the existing case and step to rewrite, delete or extend (found by grepping tests for every removed or renamed name); and the code the loop left uncohesive across `git diff <base commit>`, with how to reshape it.
3. Show the plan and wait for approval, the finish's one ask.
4. Make the reshaping and test edits, committing code and tests apart. Run only the planned test files; see each new assertion fail against the entry's old source first, committing nothing in between.
5. Run `npm run lint.fix` and `npm run check`, then `npm run validate` once, its output to `MM.DD.YY.scratch.validate.<n>.log`. One full suite on the machine at a time.
6. Map each failure to its entry and fix it there. A failure the branch's diff cannot reach is not ours: record it with that proof after one run alone. Never bisect by re-running.
7. Re-run only the failing files until each passes or is recorded, then `npm run validate` once more and push.

## Report
One line per entry (what changed, commit, the test or reason that proves it), every revert, every failure recorded as not ours, and the final validate result.

**REQUIRED SUB-SKILL:** use `skill-memory` when you learn something new.
