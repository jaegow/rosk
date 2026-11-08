# React starter kit

## Commands

Run `source ~/.nvm/nvm.sh && nvm use` before any node command (the project pins Node 24).

```bash
npm run dev                # dev server
npm run build              # typecheck and bundle
npm run check              # lint and typecheck
npm run lint               # lint only
npm run lint.fix           # lint, fixing what it can
npm run lint.types         # typecheck only
npm run test:unit          # unit-node and unit (jsdom) projects
npm run test:browser       # browser project (Playwright, Chromium)
npm run test:all           # every project
npm run check:skill-trees  # lint every skill and its decision tree
npm run validate           # check, skill-tree lint and every test
```

## Local working notes

- Scratch files live at the project root as `MM.DD.YY.scratch.<kind>.<short-description>.<ext>`; a job writing many takes one `MM.DD.YY.scratch.<kind>.<short-description>/` folder. Never beside the checkout or in `/tmp`.
- `.scratch.` is what the gitignore keys on: omit it and the file gets committed.
- Before a commit staged broadly, read `git status --short` for stray paths outside `src/`, `scripts/` and `.claude/`. Untrack one with `git rm --cached <file>`.

## Worktrees

- Make one only when work needs files on disk at another commit; reading needs none (`git show <rev>:<path>`, `git grep <rev>`).
- Put it at `.claude/worktrees/<name>`, never beside the checkout or in `/tmp`, and `git worktree remove` it when done.

## Routing

- `src/feature/route/sitemap.ts`
- `src/feature/app/App.router.tsx`

## Where things live

- The pattern to copy for a new feature: `src/feature/example/` (types, service, mock, domain hook, page, tests).
- The component set: `src/design-system/index.ts`; each member has a `<Name>.gallery.tsx` the gallery at `/gallery` discovers.
- Tokens: `src/style/theme.css` only.
- Test setup and shared helpers: `src/testing/`; the three Vitest projects are in `vite.config.ts`.
- The React Compiler is on: no manual `useMemo`, `useCallback` or `memo`, and every hook call is named `use…`.

## Comments

Source carries no comments; the only exceptions are a required lint directive and a one-line `DIVERGENCE` marker, as `.claude/skills/conventions/tree/dx/always/comments.md` says.

## Skills

- Code, UX, tests, styling: `.claude/skills/conventions/SKILL.md`
- Designing or planning before code: `.claude/skills/plan/SKILL.md`
- Audits and tidying: `.claude/skills/audit/SKILL.md`
- A quick change loop: `.claude/skills/quick-iterate/SKILL.md`
- Syncing a branch with its base: `.claude/skills/catch-up/SKILL.md`
- A session retrospective: `.claude/skills/retro/SKILL.md`
- Recording what a skill learned: `.claude/skills/skill-memory/SKILL.md`
- Writing any skill file: `.claude/skills/AUTHORING.md`
