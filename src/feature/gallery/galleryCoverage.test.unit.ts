import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const FEATURE = fileURLToPath(new URL('../', import.meta.url))

const designSystemTest = readFileSync(new URL('../../design-system/designSystem.test.unit.ts', import.meta.url), 'utf8')

const setFolders = [...(designSystemTest.match(/const SET_FOLDERS = \[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g)]
  .map((match) => match[1] ?? '')

describe('gallery coverage', () => {
  it('reads the set folders the design-system test owns', () => {
    expect(setFolders).toEqual(expect.arrayContaining(['cta', 'tabs']))
  })

  it('gives every set folder a gallery entry', () => {
    expect(setFolders.filter((folder) => !readdirSync(path.join(FEATURE, folder)).some((file) => file.endsWith('.gallery.tsx')))).toEqual([])
  })
})
