# Skill authoring

Shared practice for every file under `.claude/skills`. Not a skill itself.

## The skills

| Skill | Purpose |
|---|---|
| `conventions` | The one decision tree for code (dx), user experience (ux), tests (testing) and styling (style). |
| `plan` | Settle a feature's behaviour and code shape before any code, asking few questions. |
| `audit` | Audit a skill, the code, comments, the test suite, the views, or local state. |
| `quick-iterate` | A ledgered loop of quick changes, proven together at the end. |
| `catch-up` | Merge the base branch into a branch and fix what the merge broke. |
| `retro` | Turn a session's slow or wrong moments into checks, scripts and rules. |
| `skill-memory` | How a skill records and retires dated findings. |

## Voice

- One plain instruction per line, in the imperative; a condition as "if …, do …".
- A bullet only for a real list; a parenthesis only for a short example.
- Bold nothing but `**REQUIRED SUB-SKILL:**`; start a line `CRITICAL:` for the two or three rules that must survive a skim.

## Keep the instruction and the tell

A reader needs what to do and how to recognise the situation.
Keep a clause of why only where its absence invites re-litigation.
Cut anecdotes, dates, timings, measurements, counts, one file's symptom, and a second sentence defending the first.
CRITICAL: list every rule before a rewrite and grep each back after it; a rewrite that loses a rule is worse than the bloat it removed.

## CRITICAL: a general rule carries no code pointers

- No code example, file path, illustrative component or hook name, issue id, or the name of the check that enforces it.
- No narration: history, what the code does today, counts of what exists.
- A name stays only when it is the rule's subject: a primitive's own contract, a naming grammar, a named exemption, a named trap.

## Tree-shaped skills

- One decision per file under `tree/`, with flat frontmatter: `id` (its path), `kind` (`rule` or `question`), `status` (`settled`, `open` or `conflict`), and `question` plus `default` on a question, `provisional` on a node not settled. Only `tree/index.md` is `kind: index`.
- A question's branches are its bullets, each leading with one link; its `default` is one of them.
- A rule node lists what to read next under `## Also`.
- `npm run check:skill-trees` enforces this shape, every link, reachability and the reference rules below.

## CRITICAL: no cross-skill references

- Never send the reader to another skill for content; state the part this skill needs in its own words, or leave it out.
- Two exceptions: your own `memory.md`, and a declared dependency on a `**REQUIRED SUB-SKILL:**` line.
- Never name a skill that does not exist.

## Code blocks in a skill

Tag a comment that teaches rather than ships `// DOC:`, so it is never copied into source.

## Test a skill against the request

Give a fresh agent testing a skill the developer's original request beside it, and have it report where the request asked for something the skill does not produce.

## Justify new content

Before adding a line, name what the skill misses without it and why that matters; restating an existing rule does not earn a place.
