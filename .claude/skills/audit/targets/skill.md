# Audit a skill

1. Run `npm run check:skill-trees`; a failure is a finding.
2. Read the skill whole. For each `open` or `conflict` node, confirm its provisional still matches the code's dominant pattern; for each settled node, confirm what it names still exists and behaves as stated.
3. Code-pointer check: a general rule holding a code example, a path, an illustrative component name or narration (history, counts, what the code does today) is a finding. A name that is the rule's own subject is fine.
4. Placement check: a rule deciding what the user perceives or can do belongs in the tree's `ux` branch; one deciding how code produces it in `dx`; a test's mechanics in `testing`; a class or token in `style`. A rule in the wrong branch, or stated twice, is a finding: move it, splitting one that does both.
5. Tool-redundancy check: sort each convention as fully enforced (prompt to delete), partly enforced (cut to what no tool sees), or not enforced (leave it).
6. Validate `memory.md`: verify each entry against the code; prompt to fold it into the skill, delete it, or keep it.
7. Write one dated entry in the skill's `memory.md`, grouped as violations, drift, candidate rules and stale memory; edit nothing else without a yes.
