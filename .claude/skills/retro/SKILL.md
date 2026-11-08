---
name: retro
description: Use only when the user asks for a retrospective on a session, to find what the environment made slow or wrong and change it so the next session avoids it.
---

# Retro

Find what the environment made slow or wrong, and move each lesson to the cheapest place that stops it recurring. Change the environment, never the session's feature code.

## Read the session
The log is `~/.claude/projects/<working directory, slashes as dashes>/<session id>.jsonl`, the newest one for the current session, with subagent logs under `<session id>/subagents/`.
CRITICAL: never read a log into context; fork the reading and have it return cited moments only: timestamp, short quote, tool call, cost, what went wrong.
Tells: the user correcting or repeating; a retracted claim; a step retried or redone; a long search; repeated near-identical calls; an unreachable fact; a large result barely used; a check that passed and missed; a secret printed into a result.

## Route each moment to its cheapest home
1. A check (a lint rule, a script, the skill-tree lint, a unit test). A mechanical mistake always lands here. A test changes only to fix a flaky one.
2. A hook or permission in `.claude/settings.json`, for a call that should never run.
3. A script, for a sequence repeated by hand.
4. A node in the conventions tree, for a judgement call.
5. A line in the skill the moment happened under.
6. A pointer in `CLAUDE.md`, only for a file nothing else points at.
7. A `memory.md` entry, only for a fact no file can hold.

Read the existing checks and scripts first: a check that exists but is unwired or passes silently is the finding.
When a tool seems not to do what its doc says, check whether one caller compensates before disbelieving the doc: the fix belongs at the root.

## Present and ship
Put a printed secret first: tell the user to rotate it.
Show one row per candidate, most costly first (a wrong outcome, then minutes waited, then tokens): cost, home, change. Ask which to ship.
Ship each from a worktree under `.claude/worktrees/` off the base branch, one PR each; a tree change is a RULING checked with `npm run check:skill-trees`.
