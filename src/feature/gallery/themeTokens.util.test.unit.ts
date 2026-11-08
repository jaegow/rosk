import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { declarationStyle, parseThemeTokens } from './themeTokens.util'

const THEME_CSS = readFileSync(new URL('../../style/theme.css', import.meta.url), 'utf8')

const FIXTURE = `
@theme {
  --color-*: initial;
  --color-base: #FFFFFF;
  --color-brand: #3A44A6;
  --spacing: 0.25rem;
  --spacing-gutter: 1.5rem;
  --radius-md: 0.5rem;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.08);
  --z-index-modal: 1100;
  --animate-fade-in: fade-in 150ms ease-out;
}
@theme static {
  --color-stress-xs: color-mix(in srgb, var(--color-stress) 6%, transparent);
  --color-brand-tint: color-mix(in srgb, var(--color-brand), var(--color-base) 66%);
}
@layer mode {
  :root[data-theme="dark"] {
    --color-base: #121318;
  }
}
@utility text-h1 { font-size: 2.5rem; font-weight: 700; }
@utility stress-xs { background-image: none; }
`

describe('parseThemeTokens', () => {
  it('lists each kind of token in declaration order, keeping the first value of a token a mode redefines', () => {
    expect(parseThemeTokens(FIXTURE)).toEqual({
      color: [
        { name: 'base', value: '#FFFFFF' },
        { name: 'brand', value: '#3A44A6' },
        { name: 'brand-tint', value: 'color-mix(in srgb, var(--color-brand), var(--color-base) 66%)' },
      ],
      stress: [{ name: 'stress-xs', value: 'color-mix(in srgb, var(--color-stress) 6%, transparent)' }],
      text: [{ name: 'h1', value: 'font-size: 2.5rem; font-weight: 700;' }],
      spacing: [{ name: 'gutter', value: '1.5rem' }],
      radius: [{ name: 'md', value: '0.5rem' }],
      shadow: [{ name: 'sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.08)' }],
      layer: [{ name: 'modal', value: '1100' }],
      motion: [{ name: 'fade-in', value: 'fade-in 150ms ease-out' }],
    })
  })

  it('reads every token family the theme stylesheet ships', () => {
    const tokens = parseThemeTokens(THEME_CSS)
    expect(tokens.color.map((token) => token.name)).toEqual(expect.arrayContaining(['base', 'brand', 'backdrop', 'info', 'danger-tint']))
    expect(tokens.stress.map((token) => token.name)).toEqual(expect.arrayContaining(['stress', 'stress-xxl', 'stress-xs-inverse', 'stress-disabled']))
    expect(tokens.text.map((token) => token.name)).toEqual(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'body3', 'caption'])
    expect(tokens.spacing.map((token) => token.name)).toEqual(['gutter', 'inset'])
    expect(tokens.radius.map((token) => token.name)).toEqual(['sm', 'md', 'lg', 'xl', 'full'])
    expect(tokens.shadow.map((token) => token.name)).toEqual(['sm', 'md', 'lg'])
    expect(tokens.layer.map((token) => token.name)).toEqual(['drawer', 'modal', 'popover', 'dropdown', 'toast', 'tooltip'])
    expect(tokens.motion.map((token) => token.name)).toEqual(expect.arrayContaining(['fade-in', 'spinner']))
  })
})

describe('declarationStyle', () => {
  it('turns a declaration block into a style object with camelCase properties', () => {
    expect(declarationStyle('font-size: 2.5rem; font-weight: 700; letter-spacing: -0.02em;')).toEqual({
      fontSize: '2.5rem',
      fontWeight: '700',
      letterSpacing: '-0.02em',
    })
  })
})
