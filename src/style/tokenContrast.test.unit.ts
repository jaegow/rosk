import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { composite, contrastRatio, WCAG_AA_LARGE_TEXT, WCAG_AA_TEXT } from './contrast'

const theme = readFileSync(new URL('./theme.css', import.meta.url), 'utf8')

const blockAfter = (opener: string, occurrence = 0): string => {
  const start = Array.from({ length: occurrence }).reduce<number>((from) => theme.indexOf(opener, from + 1), theme.indexOf(opener))
  if (start === -1) throw new Error(`theme.css has no block opening with ${opener}`)
  const bodyStart = start + opener.length
  return theme.slice(bodyStart, theme.indexOf('}', bodyStart))
}

const declarations = (block: string): Map<string, string> =>
  new Map([...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1] ?? '', (match[2] ?? '').trim()]))

const lightPalette = declarations(blockAfter('@theme static {'))
const ladder = declarations(blockAfter('@theme static {', 1))
const scopedLadder = declarations(blockAfter(':root, [data-theme] {'))
const lightMode = declarations(blockAfter(':root, [data-theme="light"] {'))
const darkMode = declarations(blockAfter('\n  [data-theme="dark"] {'))
const systemDarkMode = declarations(blockAfter(':root:not([data-theme="light"]) {'))

type Mode = 'light' | 'dark'

const tokenIn = (mode: Mode, name: string): string => {
  const value = (mode === 'dark' ? darkMode.get(name) : undefined) ?? lightMode.get(name) ?? lightPalette.get(name)
  if (value === undefined) throw new Error(`theme.css declares no ${name} in ${mode} mode`)
  return value
}

const color = (mode: Mode, name: string) => tokenIn(mode, `--color-${name}`)

const alpha = (mode: Mode, rung: string) => Number.parseFloat(tokenIn(mode, `--stress-alpha-${rung}`)) / 100

const STATUS_HUES = ['info', 'success', 'warning', 'danger']

const INK_RUNGS = ['xl', 'xxl']

const MODES: Mode[] = ['light', 'dark']

describe('theme tokens', () => {
  it('declares the system dark block identically to the explicit dark block', () => {
    expect(Object.fromEntries(systemDarkMode)).toEqual(Object.fromEntries(darkMode))
  })

  it('redeclares the whole ladder on every themed element so a subtree can switch modes', () => {
    expect(Object.fromEntries(scopedLadder)).toEqual(Object.fromEntries(ladder))
  })

  it('restates the light palette on every light element', () => {
    for (const [name, value] of lightMode) {
      if (lightPalette.has(name)) expect(value).toBe(lightPalette.get(name))
    }
    expect([...darkMode.keys()].filter((name) => !lightMode.has(name))).toEqual([])
  })

  it('overrides only tokens the light palette declares', () => {
    const known = new Set([...lightPalette.keys(), ...lightMode.keys()])
    expect([...darkMode.keys()].filter((name) => !known.has(name))).toEqual([])
  })

  it.each(MODES)('declares every stress alpha in %s mode', (mode) => {
    for (const rung of ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'hover', 'selected', 'outline', 'disabled']) {
      expect(alpha(mode, rung)).toBeGreaterThan(0)
      expect(alpha(mode, rung)).toBeLessThanOrEqual(1)
    }
  })

  it.each(MODES)('orders the stress size ladder by strength in %s mode', (mode) => {
    const strengths = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((rung) => alpha(mode, rung))
    expect(strengths).toEqual([...strengths].sort((first, second) => first - second))
  })
})

describe('stress ink contrast', () => {
  it.each(MODES)('stress on base passes AA in %s mode', (mode) => {
    expect(contrastRatio(color(mode, 'stress'), color(mode, 'base'))).toBeGreaterThanOrEqual(WCAG_AA_TEXT)
  })

  it.each(MODES.flatMap((mode) => INK_RUNGS.map((rung) => [mode, rung] as const)))('in %s mode the stress-%s ink rung on base passes AA', (mode, rung) => {
    const ink = composite(color(mode, 'stress'), alpha(mode, rung), color(mode, 'base'))
    expect(contrastRatio(ink, color(mode, 'base'))).toBeGreaterThanOrEqual(WCAG_AA_TEXT)
  })

  it.each(MODES.flatMap((mode) => STATUS_HUES.map((hue) => [mode, hue] as const)))('in %s mode stress on the %s tint passes AA', (mode, hue) => {
    const tint = composite(color(mode, 'base'), alpha(mode, 'xl'), color(mode, hue))
    expect(contrastRatio(color(mode, 'stress'), tint)).toBeGreaterThanOrEqual(WCAG_AA_TEXT)
  })

  it.each(MODES.flatMap((mode) => STATUS_HUES.map((hue) => [mode, hue] as const)))('in %s mode stress-xxl on the %s tint passes AA', (mode, hue) => {
    const tint = composite(color(mode, 'base'), alpha(mode, 'xl'), color(mode, hue))
    const ink = composite(color(mode, 'stress'), alpha(mode, 'xxl'), tint)
    expect(contrastRatio(ink, tint)).toBeGreaterThanOrEqual(WCAG_AA_TEXT)
  })

  it.each(MODES)('brand on base passes AA in %s mode', (mode) => {
    expect(contrastRatio(color(mode, 'brand'), color(mode, 'base'))).toBeGreaterThanOrEqual(WCAG_AA_TEXT)
  })

  it.each(MODES)('the outline rung is visible against base in %s mode', (mode) => {
    const outline = composite(color(mode, 'stress'), alpha(mode, 'outline'), color(mode, 'base'))
    expect(contrastRatio(outline, color(mode, 'base'))).toBeGreaterThan(1.2)
    expect(contrastRatio(outline, color(mode, 'base'))).toBeLessThan(WCAG_AA_LARGE_TEXT)
  })
})
