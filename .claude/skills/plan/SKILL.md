---
name: plan
description: Use when designing or planning work in this repo before code: shaping a feature, a brainstorming or plan-mode session, or writing a plan for an agent to build.
---

# Plan

Settle how the work behaves and how its code is written before any code. Let the conventions tree answer most questions, and ask few.

**REQUIRED SUB-SKILL:** use `conventions` to walk the tree.

## Before the first message
1. Read `CLAUDE.md`, then walk every branch the work touches, for every file it adds or changes and every choice the user asked for. CRITICAL: finish the walk before the first message.
2. Judge a request by the outcome the user wants, not the form they named: if a settled node delivers that outcome, take it, record the row settled and name the requested form in its Note.
3. Give every GAP, OPEN or CONFLICT row its default without asking, named in its Note.

## The first message, in order
1. `Divergences`: one bullet per request no settled node delivers (`node id: asked; tree says`) and per new rule asked for where no node decides. With none, say so as its own heading.
2. Summary, in two or three sentences.
3. User stories: `As a <role>, I want …, so that …`, one per thing asked for.
4. Data as the screen uses it: `thing · shown, set or cleared · where`.
5. Exactly one ask: the first planning question the tree cannot answer (scope, intent, data behaviour); once none remain, one divergence, carrying how the settled pattern works today on a real place in the code, what the request needs, the pattern as a new rule on the same places, then "one-off, or a new rule?".

Ask the next one in each later message. A divergence found meanwhile joins the list and waits: an answer to a planning question often dissolves it.

## The plan document
Write the plan with the walk's `## Decisions` table; in a task-by-task plan, put each row in the task that implements it.
A RULING ships straight away in its own skills-only PR from a worktree under `.claude/worktrees/`, edited and checked with `npm run check:skill-trees`, unless the node edit names code the work adds.
A task brief for another agent states its done-when so a fresh reader can check it, and:
- requires fixing every site it can already name as broken, never recording them;
- counts call sites to reconcile, read one by one, never a grep's tally of a class or name;
- checks claimed independence by grepping each task's tokens against the others' files;
- offers an alternative only after confirming it is reachable;
- says "edit the file forward" wherever it anticipates an undo, never a destructive git command.

Call out gaps; never turn them into tasks or issues from here.

**REQUIRED SUB-SKILL:** use `skill-memory` when you learn something new.
