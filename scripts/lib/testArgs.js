const TEST_USAGE = `Usage: node scripts/test.js [options] [vitest args...]

Runs the unit suites (unit-node and unit) and the browser suite, reports both, and exits
non-zero if either failed. Every other argument passes through to vitest, so a path or a
-t filter scopes whichever suites are still enabled. A suite no path can reach is skipped.

      --no-unit     skip the unit suites
      --no-browser  skip the browser suite
      --changed     run only tests affected by files changed against the base
      --base <ref>  base for --changed (default origin/master, falling back to master)
  --                end of runner options; everything after goes to vitest
  -h, --help        this message`

const RUNNER_FLAGS = new Set(['--unit', '--no-unit', '--browser', '--no-browser', '--changed', '-h', '--help'])

const VITEST_OPTIONS_WITH_VALUE = new Set([
  '-t', '--testNamePattern',
  '-c', '--config',
  '--reporter', '--outputFile', '--shard', '--project', '--exclude',
  '--bail', '--retry', '--testTimeout', '--maxWorkers', '--sequence.seed',
])

const parseTestArgs = (argv) => {
  const parsed = { unit: true, browser: true, changed: false, base: undefined, help: false, passthrough: [], paths: [] }
  let runnerOptionsEnded = false
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!runnerOptionsEnded && arg === '--') {
      runnerOptionsEnded = true
      continue
    }
    if (!runnerOptionsEnded && RUNNER_FLAGS.has(arg)) {
      if (arg === '-h' || arg === '--help') parsed.help = true
      else if (arg === '--changed') parsed.changed = true
      else parsed[arg.replace(/^--(no-)?/, '')] = !arg.startsWith('--no-')
      continue
    }
    if (!runnerOptionsEnded && (arg === '--base' || arg.startsWith('--base='))) {
      const value = arg === '--base' ? argv[++index] : arg.slice('--base='.length)
      if (value === undefined || value === '') throw new Error('--base needs a git ref')
      parsed.base = value
      continue
    }
    parsed.passthrough.push(arg)
    if (arg.startsWith('-')) {
      if (VITEST_OPTIONS_WITH_VALUE.has(arg) && index + 1 < argv.length) parsed.passthrough.push(argv[++index])
      continue
    }
    parsed.paths.push(arg)
  }
  return parsed
}

const UNIT_TEST_FILE = /\.test\.unit\.tsx?$/
const BROWSER_TEST_FILE = /\.test\.browser\.tsx?$/

const suitesReached = (paths) => {
  if (paths.length === 0) return { unit: true, browser: true }
  return {
    unit: paths.some((path) => !BROWSER_TEST_FILE.test(path)),
    browser: paths.some((path) => !UNIT_TEST_FILE.test(path)),
  }
}

export { parseTestArgs, suitesReached, TEST_USAGE }
