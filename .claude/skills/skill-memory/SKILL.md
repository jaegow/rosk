---
name: skill-memory
description: Use when a skill says to record what you learned, or before relying on a skill's memory.md finding.
---

# Skill memory

Keep `SKILL.md` and tree nodes as stable instructions; put dated findings in the skill's own `memory.md`, created if absent with its header line alone.
Record a finding only when it is non-obvious, informs current work, and makes the file better.

```markdown
- **YYYY-MM-DD** - What happened, why, the fix or workaround, and what is still open.
```

- Delete a resolved finding; move a finding that has become a rule into the skill or its tree.
- CRITICAL: never count outstanding work ("12 files still exempt"); give the grep and let the reader count. A count that can no longer move is fine.
- CRITICAL: locate by file name and symbol, never a line number or full path; add one folder only to disambiguate.
- Treat an entry as a point-in-time observation: verify it against the code before relying on it.
