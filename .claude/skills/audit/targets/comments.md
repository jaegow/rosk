# Audit comments

The policy is the tree's `dx/always/comments`: source carries no comments except a required directive or a one-line `DIVERGENCE` marker.

1. Scope: the path given, else `src/` and `scripts/`.
2. List every comment: `rg -n --pcre2 '^\s*(//|/\*|\*)|\s//\s' <scope> -g '*.{ts,tsx,js,css}'`, then read each in place.
3. A lint or type directive: delete it, run `npm run check`, and restore it only if the check fails without it. For `@ts-expect-error`, confirm the error it swallows is the one intended.
4. A `DIVERGENCE` line: confirm its node id exists, the node is settled, and the code still departs from it; otherwise delete it.
5. Any other comment: delete it. If it carried a real fact, make the code say it (a name, a type, an explicit value, a test title) and report that change as a follow-up; never keep the comment to defer it.
6. Apply the deletions, run `npm run check`, and report the two lists.
