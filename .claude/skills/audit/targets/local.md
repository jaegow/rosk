# Audit local state

Tidy scratch files, local branches and worktrees. Delete files only after classifying them; never delete a branch or worktree yourself.

1. Run `git fetch --prune origin`.
2. Scratch: read every `*.scratch.*` file and folder at the project root; grep a `.log` for failures rather than reading it whole. List its items: requested work, open questions, deferred items. Narrative, settled decisions and unrequested ideas are not items.
3. Classify each item with proof against the base branch: done (the commit or line), in flight (an open PR or pushed branch), superseded (what replaced it), or open (cite the search that came back empty, against the current text, never a remembered phrase).
4. Local-only work is not done: an unpushed commit, a dirty worktree, a patch file. Keep a patch until its changes are pushed or the user drops it.
5. A bug that depends on what the server sends is open only once the server's contract shows it can happen.
6. Report open items for the user to keep; with a yes, write each into the skill whose tree or `memory.md` it concerns. Then delete the root scratch files the user approved.
7. Branches: a branch is deletable when every line it changes is on the base branch, judged by content, never ancestry (squash merges match neither); one with an open PR or a dirty worktree stays.
8. Report deleted files with their proof, the kept branches and why, and one pasteable command: `git worktree remove <path> && git branch -D <branch> && git worktree prune`.
