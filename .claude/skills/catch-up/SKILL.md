---
name: catch-up
description: Use when asked to catch a branch up, sync it with the base branch, or update an open PR with the base branch's latest changes.
---

# Catch up

Report only at the end; make every edit as a quiet step.

**REQUIRED SUB-SKILL:** use `conventions` for steps 4 and 5.

1. Never run on the base branch; with uncommitted changes, stop and ask.
2. `git fetch origin && git merge origin/<base>`. Never rebase, never force-push.
3. Resolve conflicts keeping the branch's intent unless the base changed the same contract. List files both sides changed, against the branch tip before the merge: they can merge clean and still clash in meaning.
4. A conflicted test resolves to what the code does once both sides are in: one case per behaviour, none for removed behaviour, none the merge adds. Walk the conventions tree's testing branch first.
5. Walk the tree over the lines the base changed and fix drift only there, in its own commit; report divergences and OPEN calls instead of fixing them.
6. Run `npm run validate` once. Re-run a failure alone before calling it real, fix every real failure in the case that covers it, grouped by cause, then re-run only the touched files.
7. Commit merge fixes apart from the merge commit. With an open PR and everything green, `git push`; anything red, report and do not push.
8. Report conflicts resolved, drift fixed, fixes made, check results, and whether the PR was updated.
