import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const FEATURE = fileURLToPath(new URL('../feature/', import.meta.url))

const barrel = readFileSync(new URL('./index.ts', import.meta.url), 'utf8')

const SET_FOLDERS = ['alert', 'banner', 'chip', 'collapsible', 'count-badge', 'cta', 'divider', 'dropdown-menu', 'icon', 'info', 'popover', 'side-indicator', 'skeleton', 'spinner', 'tabs', 'toast', 'tooltip', 'card', 'empty-state', 'modal', 'nav', 'page', 'table', 'form']

const componentSources = (folder: string) => readdirSync(path.join(FEATURE, folder))
  .filter((file) => file.endsWith('.tsx') && !file.includes('.test.'))
  .map((file) => ({ file, source: readFileSync(path.join(FEATURE, folder, file), 'utf8') }))

describe('design-system barrel', () => {
  it('exports a value from every set folder', () => {
    expect(SET_FOLDERS.filter((folder) => !new RegExp(`^export \\{[^}]+\\} from '@/feature/${folder}/`, 'm').test(barrel))).toEqual([])
  })

  it('gives every set folder a slot module and sets every data-slot from it', () => {
    expect(SET_FOLDERS.filter((folder) => !readdirSync(path.join(FEATURE, folder)).some((file) => file.endsWith('Slot.ts')))).toEqual([])
    expect(SET_FOLDERS.flatMap(componentSources).filter((entry) => /data-slot="/.test(entry.source)).map((entry) => entry.file)).toEqual([])
  })

  it('names every part a component file declares', () => {
    const unnamed = SET_FOLDERS.flatMap(componentSources).flatMap((entry) => [...entry.source.matchAll(/^const ([A-Z]\w*) = \(/gm)]
      .map((match) => match[1] ?? '')
      .filter((name) => !entry.source.includes(`${name}.displayName = `))
      .map((name) => `${entry.file}: ${name}`))
    expect(unnamed).toEqual([])
  })
})
