import { describe, expect, it } from 'vitest'

import { parseTestArgs, suitesReached } from './testArgs.js'

describe('parseTestArgs', () => {
  it('runs both suites with nothing passed through by default', () => {
    expect(parseTestArgs([])).toEqual({ unit: true, browser: true, changed: false, base: undefined, help: false, passthrough: [], paths: [] })
  })

  it('turns a suite off', () => {
    expect(parseTestArgs(['--no-unit'])).toMatchObject({ unit: false, browser: true })
    expect(parseTestArgs(['--no-browser'])).toMatchObject({ unit: true, browser: false })
  })

  it('passes paths and vitest options through in order', () => {
    const parsed = parseTestArgs(['src/style', '--reporter', 'dot', '--no-browser', '-t', 'cn joins'])
    expect(parsed.passthrough).toEqual(['src/style', '--reporter', 'dot', '-t', 'cn joins'])
    expect(parsed.paths).toEqual(['src/style'])
    expect(parsed.browser).toBe(false)
  })

  it('never reads an option value as a path', () => {
    expect(parseTestArgs(['-t', 'src/looks-like-a-path']).paths).toEqual([])
    expect(parseTestArgs(['--testNamePattern=thing', 'src/a.test.unit.ts']).paths).toEqual(['src/a.test.unit.ts'])
  })

  it('reads --changed with an optional base in either spelling', () => {
    expect(parseTestArgs(['--changed'])).toMatchObject({ changed: true, base: undefined, passthrough: [] })
    expect(parseTestArgs(['--changed', '--base', 'main'])).toMatchObject({ changed: true, base: 'main', passthrough: [] })
    expect(parseTestArgs(['--base=origin/release']).base).toBe('origin/release')
  })

  it('rejects a --base with no ref', () => {
    expect(() => parseTestArgs(['--base'])).toThrow('--base needs a git ref')
  })

  it('hands everything after -- to vitest untouched', () => {
    const parsed = parseTestArgs(['--no-browser', '--', '--no-unit', '--help'])
    expect(parsed).toMatchObject({ unit: true, browser: false, help: false })
    expect(parsed.passthrough).toEqual(['--no-unit', '--help'])
  })

  it('reads help', () => {
    expect(parseTestArgs(['-h']).help).toBe(true)
  })
})

describe('suitesReached', () => {
  it('reaches both suites with no path', () => {
    expect(suitesReached([])).toEqual({ unit: true, browser: true })
  })

  it('reaches only the suite a test file names', () => {
    expect(suitesReached(['src/style/cn.test.unit.ts'])).toEqual({ unit: true, browser: false })
    expect(suitesReached(['src/app/App.test.unit.tsx'])).toEqual({ unit: true, browser: false })
    expect(suitesReached(['src/style/darkMode.test.browser.tsx'])).toEqual({ unit: false, browser: true })
  })

  it('reaches both suites with a directory or a mix', () => {
    expect(suitesReached(['src/style'])).toEqual({ unit: true, browser: true })
    expect(suitesReached(['a.test.unit.ts', 'b.test.browser.tsx'])).toEqual({ unit: true, browser: true })
  })
})
