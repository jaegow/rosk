import { describe, expect, it } from 'vitest'

import { parseCheckArgs } from './checkArgs.js'

describe('parseCheckArgs', () => {
  it('runs lint and types over the whole repo by default', () => {
    expect(parseCheckArgs([])).toEqual({ fix: false, lint: true, types: true, changed: false, help: false, paths: [] })
  })

  it('reads --fix and its short form', () => {
    expect(parseCheckArgs(['--fix']).fix).toBe(true)
    expect(parseCheckArgs(['-f']).fix).toBe(true)
  })

  it('turns a check off with its --no- form', () => {
    expect(parseCheckArgs(['--no-types'])).toMatchObject({ lint: true, types: false })
    expect(parseCheckArgs(['--no-lint'])).toMatchObject({ lint: false, types: true })
  })

  it('scopes the linter to bare paths', () => {
    expect(parseCheckArgs(['src/style', 'scripts/check.js', '--no-types']).paths).toEqual(['src/style', 'scripts/check.js'])
  })

  it('reads --changed with an optional base', () => {
    expect(parseCheckArgs(['--changed']).changed).toBe(true)
    expect(parseCheckArgs(['--changed']).base).toBeUndefined()
    expect(parseCheckArgs(['--changed', '--base', 'origin/release'])).toMatchObject({ changed: true, base: 'origin/release' })
    expect(parseCheckArgs(['--changed', '--base=main'])).toMatchObject({ base: 'main' })
  })

  it('reads help', () => {
    expect(parseCheckArgs(['-h']).help).toBe(true)
    expect(parseCheckArgs(['--help']).help).toBe(true)
  })

  it('rejects an unknown option instead of ignoring it', () => {
    expect(() => parseCheckArgs(['--fxi'])).toThrow()
  })
})
