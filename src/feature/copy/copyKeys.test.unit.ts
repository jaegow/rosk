import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import en from '../i18n/en.json'

const SRC = fileURLToPath(new URL('../../', import.meta.url))

const productionSources = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
  .filter((file) => /\.(ts|tsx)$/.test(file) && !/\.test\.|\.d\.ts$/.test(file) && !file.startsWith(`testing${path.sep}`))
  .map((file) => readFileSync(path.join(SRC, file), 'utf8'))

const quotedLiterals = (source: string): string[] =>
  [...source.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`([^`$\\]*)`/g)].map((match) => match[1] ?? match[2] ?? match[3] ?? '')

const copyCalls = (source: string): string[] =>
  [...source.matchAll(/\bt\(\s*(['"`])((?:(?!\1).)*)\1/g)].map((match) => match[2] ?? '')

const pluralBase = (key: string) => key.replace(/_(zero|one|two|few|many|other)$/, '')

const keys = Object.keys(en)

describe('copy keys', () => {
  it('keeps every key flat and under common.*', () => {
    expect(keys.filter((key) => !/^common(\.[a-z][a-zA-Z0-9]*)+(_(one|other))?$/.test(key))).toEqual([])
  })

  it('has no orphan key: each is referenced as a whole literal in production source', () => {
    const referenced = new Set(productionSources.flatMap(quotedLiterals))
    expect(keys.filter((key) => !referenced.has(pluralBase(key)) && !referenced.has(key))).toEqual([])
  })

  it('has no missing key: every literal t() call names a key en.json defines', () => {
    const known = new Set([...keys, ...keys.map(pluralBase)])
    expect(productionSources.flatMap(copyCalls).filter((key) => !known.has(key))).toEqual([])
  })

  it('detects a substring-only reference as an orphan and a typo as missing', () => {
    expect(quotedLiterals('t(\'common.nav.galleryItems\')')).not.toContain('common.nav.gallery')
    expect(copyCalls('t(\'common.nope\')')).toEqual(['common.nope'])
  })
})
