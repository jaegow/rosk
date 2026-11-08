---
id: style/merge
kind: rule
status: settled
---
# Class merging

- Register every custom utility that conflicts with another in `cn`'s tailwind-merge config, under the group it conflicts in.
- A class belongs to exactly one group: registering it in two keeps only the last, silently.
- Leave a compound (multi-property) utility unregistered unless it has a real conflict partner; filed under a single-property group, a later class there deletes properties it never meant to reach.
- Prove a registration by probing `cn` with the conflicting pair, never by reading the config.
