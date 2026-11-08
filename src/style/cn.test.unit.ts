import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { cn, LAYER_CLASSES, MOTION, NAMED_SPACING, STRESS_OVERLAY_CLASSES, TYPOGRAPHY_SCALE } from './cn'

const theme = readFileSync(new URL('./theme.css', import.meta.url), 'utf8')

const COMPOUND_UTILITIES = ['focus-ring', 'full-bleed']

const declaredUtilities = [...theme.matchAll(/^@utility ([\w-]+)/gm)].map((match) => match[1] ?? '')

const themeKeys = (namespace: string) =>
  [...theme.matchAll(new RegExp(`^\\s*--${namespace}-([\\w-]+):`, 'gm'))].map((match) => match[1] ?? '')

describe('cn', () => {
  it('joins conditional classes and drops falsy ones', () => {
    expect(cn('a', false, null, undefined, ['b', { c: true, d: false }])).toBe('a b c')
  })

  it('lets the later typography role win', () => {
    expect(cn('text-body1', 'text-h3')).toBe('text-h3')
    expect(cn('text-caption', 'text-subtitle2')).toBe('text-subtitle2')
  })

  it('keeps a typography role beside an ink colour', () => {
    expect(cn('text-h3', 'text-stress-xxl')).toBe('text-h3 text-stress-xxl')
    expect(cn('text-stress', 'text-stress-xl')).toBe('text-stress-xl')
  })

  it('reads text-base as the base colour, never a size', () => {
    expect(cn('text-body1', 'text-base')).toBe('text-body1 text-base')
    expect(cn('text-stress', 'text-base')).toBe('text-base')
  })

  it('resolves stress overlays against each other and bg-none', () => {
    expect(cn('stress-xs', 'stress-hover')).toBe('stress-hover')
    expect(cn('bg-none', 'stress-xl-inverse')).toBe('stress-xl-inverse')
    expect(cn('stress-selected', 'stress-none')).toBe('stress-none')
  })

  it('keeps a stress overlay beside a background colour', () => {
    expect(cn('bg-info', 'stress-xl-inverse')).toBe('bg-info stress-xl-inverse')
  })

  it('resolves named layers against each other and numeric z-index', () => {
    expect(cn('z-modal', 'z-tooltip')).toBe('z-tooltip')
    expect(cn('z-10', 'z-drawer')).toBe('z-drawer')
  })

  it('resolves motion tokens against each other and animate-none', () => {
    expect(cn('animate-fade-in', 'animate-modal-in')).toBe('animate-modal-in')
    expect(cn('animate-spinner', 'animate-none')).toBe('animate-none')
  })

  it('resolves named spacing against the numeric scale', () => {
    expect(cn('p-4', 'p-inset')).toBe('p-inset')
    expect(cn('gap-gutter', 'gap-2')).toBe('gap-2')
    expect(cn('px-gutter', 'py-inset')).toBe('px-gutter py-inset')
  })

  it('leaves a compound utility beside the single-property classes it overlaps', () => {
    expect(cn('focus-ring', 'outline-none')).toBe('focus-ring outline-none')
    expect(cn('outline-none', 'focus-ring')).toBe('outline-none focus-ring')
  })

  it('registers every @utility in theme.css or lists it as compound', () => {
    const registered = new Set([...STRESS_OVERLAY_CLASSES, ...TYPOGRAPHY_SCALE.map((role) => `text-${role}`), ...COMPOUND_UTILITIES])
    expect(declaredUtilities.filter((utility) => !registered.has(utility))).toEqual([])
    expect([...registered].filter((utility) => !declaredUtilities.includes(utility))).toEqual([])
  })

  it('registers every z-index, animation and named spacing token', () => {
    expect(LAYER_CLASSES).toEqual(themeKeys('z-index').map((layer) => `z-${layer}`))
    expect(MOTION).toEqual(themeKeys('animate'))
    expect(NAMED_SPACING).toEqual(themeKeys('spacing'))
  })
})
