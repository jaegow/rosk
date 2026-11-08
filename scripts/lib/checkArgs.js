import { parseArgs } from 'node:util'

const CHECK_USAGE = `Usage: node scripts/check.js [options] [paths...]

Runs the linter and the typechecker, reports both, and exits non-zero if either failed.
Paths scope the linter only; the typechecker always checks every project.

  -f, --fix         auto-fix what the linter can fix
      --no-lint     skip the linter
      --no-types    skip the typechecker
      --changed     lint only files changed against the base, uncommitted ones included
      --base <ref>  base for --changed (default origin/master, falling back to master)
  -h, --help        this message`

const parseCheckArgs = (argv) => {
  const parsed = parseArgs({
    args: argv,
    options: {
      fix: { type: 'boolean', short: 'f', default: false },
      lint: { type: 'boolean', default: true },
      types: { type: 'boolean', default: true },
      changed: { type: 'boolean', default: false },
      base: { type: 'string' },
      help: { type: 'boolean', short: 'h', default: false },
    },
    allowPositionals: true,
    allowNegative: true,
    strict: true,
  })
  return { ...parsed.values, paths: parsed.positionals }
}

export { CHECK_USAGE, parseCheckArgs }
