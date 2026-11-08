import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { resolveBase } from './lib/changedFiles.js'
import { announce, row, summarize } from './lib/report.js'
import { parseTestArgs, suitesReached, TEST_USAGE } from './lib/testArgs.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const VITEST = path.join(ROOT, 'node_modules', '.bin', 'vitest')

let args
try {
  args = parseTestArgs(process.argv.slice(2))
} catch (error) {
  console.error(`${error.message}\n\n${TEST_USAGE}`)
  process.exit(1)
}

if (args.help) {
  console.log(TEST_USAGE)
  process.exit(0)
}

let changedArgs = []
if (args.changed) {
  try {
    changedArgs = [`--changed=${resolveBase({ root: ROOT, base: args.base })}`, '--passWithNoTests']
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

let running = null

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    if (running) running.kill(signal)
    process.exit(130)
  })
}

const runVitest = (projects) => new Promise((resolve) => {
  const child = spawn(VITEST, ['run', ...projects.flatMap((project) => ['--project', project]), ...changedArgs, ...args.passthrough], {
    cwd: ROOT,
    stdio: 'inherit',
  })
  running = child
  child.on('close', (code) => {
    running = null
    resolve({ ok: code === 0 })
  })
})

const reached = suitesReached(args.paths)
const startedAt = performance.now()
const entries = []

for (const [name, enabled, projects] of [['unit', args.unit, ['unit-node', 'unit']], ['browser', args.browser, ['browser']]]) {
  if (!enabled) continue
  if (!reached[name]) {
    entries.push({ name, skipped: true, ms: 0, detail: 'no path reaches this suite' })
    continue
  }
  announce(name)
  const suiteStartedAt = performance.now()
  const entry = { name, ...(await runVitest(projects)), ms: performance.now() - suiteStartedAt }
  entries.push(entry)
  console.log(row('', entry))
}

process.exit(summarize(entries, startedAt))
