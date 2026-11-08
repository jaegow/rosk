import type { CSSProperties } from 'react'

type ThemeTokenKind = 'color' | 'stress' | 'text' | 'spacing' | 'radius' | 'shadow' | 'layer' | 'motion'

type ThemeToken = {
  name: string
  value: string
}

type ThemeTokens = Record<ThemeTokenKind, ThemeToken[]>

const THEME_TOKEN_KINDS: readonly ThemeTokenKind[] = ['color', 'stress', 'text', 'spacing', 'radius', 'shadow', 'layer', 'motion']

const firstDeclarations = (css: string, prefix: string): ThemeToken[] => {
  const seen = new Map<string, string>()
  for (const match of css.matchAll(new RegExp(`--${prefix}-([a-z][a-z0-9-]*)\\s*:\\s*([^;]+);`, 'g'))) {
    const name = match[1] ?? ''
    if (!seen.has(name)) seen.set(name, (match[2] ?? '').trim())
  }
  return [...seen].map(([name, value]) => ({ name, value }))
}

const parseThemeTokens = (css: string): ThemeTokens => {
  const colors = firstDeclarations(css, 'color')
  const isStress = (token: ThemeToken) => token.name === 'stress' || token.name.startsWith('stress-')
  return {
    color: colors.filter((token) => !isStress(token)),
    stress: colors.filter(isStress),
    text: [...css.matchAll(/@utility text-([a-z0-9-]+)\s*\{([^}]*)\}/g)]
      .map((match) => ({ name: match[1] ?? '', value: (match[2] ?? '').trim() })),
    spacing: firstDeclarations(css, 'spacing'),
    radius: firstDeclarations(css, 'radius'),
    shadow: firstDeclarations(css, 'shadow'),
    layer: firstDeclarations(css, 'z-index'),
    motion: firstDeclarations(css, 'animate'),
  }
}

const declarationStyle = (declarations: string): CSSProperties => Object.fromEntries(declarations
  .split(';')
  .map((declaration) => declaration.split(':').map((part) => part.trim()))
  .filter((parts): parts is [string, string] => parts.length === 2 && parts[0] !== '' && parts[1] !== '')
  .map(([property, value]) => [property.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase()), value]))

export { declarationStyle, parseThemeTokens, THEME_TOKEN_KINDS }
export type { ThemeToken, ThemeTokenKind, ThemeTokens }
