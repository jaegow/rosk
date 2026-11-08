import { styleText } from 'node:util'

const label = (name) => styleText('bold', name.padEnd(8))

const elapsed = (ms) => styleText('dim', `${(ms / 1000).toFixed(1)}s`.padStart(6))

const verdict = (entry) => {
  if (entry.skipped) return styleText('dim', 'skip')
  return entry.ok ? styleText('green', 'pass') : styleText('red', 'fail')
}

const row = (indent, entry) =>
  `${indent}${label(entry.name)} ${verdict(entry)} ${elapsed(entry.ms)}${entry.detail ? ` ${styleText('dim', entry.detail)}` : ''}`

const announce = (name) => console.log(`\n${label(name)} ${styleText('dim', 'running')}`)

const summarize = (entries, startedAt) => {
  console.log(`\n${styleText('bold', 'summary')}`)
  entries.forEach((entry) => console.log(row('  ', entry)))
  console.log(`  ${label('total')}      ${elapsed(performance.now() - startedAt)}`)
  return entries.some((entry) => entry.ok === false) ? 1 : 0
}

export { announce, row, summarize }
