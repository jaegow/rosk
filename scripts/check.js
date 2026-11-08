import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { changedFiles } from './lib/changedFiles.js'
import { CHECK_USAGE, parseCheckArgs } from './lib/checkArgs.js'
import { announce, row, summarize } from './lib/report.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OXLINT = path.join(ROOT, 'node_modules', '.bin', 'oxlint')
const TSC = path.join(ROOT, 'node_modules', '.bin', 'tsc')
const LINTABLE = ['.ts', '.tsx', '.js']
const MAX_FIX_PASSES = 5

let args
try {
  args = parseCheckArgs(process.argv.slice(2))
} catch (error) {
  console.error(`${error.message}\n\n${CHECK_USAGE}`)
  process.exit(1)
}

if (args.help) {
  console.log(CHECK_USAGE)
  process.exit(0)
}

const missing = [OXLINT, TSC].filter((bin) => !existsSync(bin))
if (missing.length > 0) {
  console.error(`missing ${missing.join(', ')}: run npm install`)
  process.exit(1)
}

const run = (bin, binArgs, capture = false) =>
  spawnSync(bin, binArgs, { cwd: ROOT, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit' })

const lint = () => {
  const targets = args.changed ? changedFiles({ root: ROOT, base: args.base, extensions: LINTABLE }) : args.paths
  if (args.changed && targets.length === 0) return { skipped: true, detail: 'no changed lintable files' }
  const lintArgs = targets.length > 0 ? targets : ['.']
  if (args.fix) {
    for (let pass = 0; pass < MAX_FIX_PASSES; pass += 1) {
      run(OXLINT, ['--fix', ...lintArgs], true)
      if (run(OXLINT, lintArgs, true).status === 0) break
    }
  }
  return { ok: run(OXLINT, lintArgs).status === 0 }
}

const types = () => {
  const projects = JSON.parse(readFileSync(path.join(ROOT, 'tsconfig.json'), 'utf8')).references.map((reference) => reference.path)
  const failed = projects.filter((project) => run(TSC, ['-p', project, '--noEmit']).status !== 0)
  return failed.length === 0 ? { ok: true } : { ok: false, detail: `failed: ${failed.join(', ')}` }
}

const startedAt = performance.now()
const entries = []

for (const [name, enabled, task] of [['lint', args.lint, lint], ['types', args.types, types]]) {
  if (!enabled) continue
  announce(name)
  const taskStartedAt = performance.now()
  let result
  try {
    result = task()
  } catch (error) {
    console.error(String(error))
    result = { ok: false, detail: 'crashed' }
  }
  const entry = { name, ...result, ms: performance.now() - taskStartedAt }
  entries.push(entry)
  console.log(row('', entry))
}

process.exit(summarize(entries, startedAt))
