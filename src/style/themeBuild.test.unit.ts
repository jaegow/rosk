import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname } from 'node:path'

import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'

const themePath = new URL('./theme.css', import.meta.url)

const theme = readFileSync(themePath, 'utf8')

const tailwindEntry = createRequire(import.meta.url).resolve('tailwindcss/index.css')

const buildWithoutUtilities = async (): Promise<string> => {
  const compiler = await compile(theme, {
    base: dirname(themePath.pathname),
    loadStylesheet: async (id) => {
      if (id !== 'tailwindcss') throw new Error(`theme.css imports an unexpected stylesheet ${id}`)
      return { path: tailwindEntry, base: dirname(tailwindEntry), content: readFileSync(tailwindEntry, 'utf8') }
    },
  })
  return compiler.build([])
}

const declaredThemeVars = [...theme.matchAll(/^\s*(--(?:color|radius|shadow|z-index|spacing|animate|motion|font)-[\w-]+):/gm)]
  .map((match) => match[1] ?? '')

describe('theme build', () => {
  it('ships every theme variable even when no utility reads it', async () => {
    const css = await buildWithoutUtilities()
    expect(declaredThemeVars).toEqual(expect.arrayContaining(['--radius-xl', '--shadow-md', '--color-backdrop']))
    expect(declaredThemeVars.filter((name) => !css.includes(`${name}:`))).toEqual([])
  })
})
