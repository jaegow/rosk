import type { ReactNode } from 'react'

import { useCopy } from '@/feature/copy/useCopy'

import { declarationStyle, THEME_TOKEN_KINDS, type ThemeToken, type ThemeTokenKind, type ThemeTokens } from './themeTokens.util'

type GalleryTokensProps = {
  tokens: ThemeTokens
}

type TokenSwatchProps = {
  kind: ThemeTokenKind
  token: ThemeToken
}

const TokenSwatch = ({ kind, token }: TokenSwatchProps) => (
  <figure className="flex min-w-0 flex-col gap-2">
    {((): ReactNode => {
      switch (kind) {
        case 'color':
          return (
            <span
              className="block h-12 w-full rounded-md border border-stress-outline"
              style={{ background: `var(--color-${token.name}, ${token.value})` }}
            />
          )
        case 'stress':
          return (
            <span className={token.name.endsWith('-inverse') ? 'block rounded-md bg-stress' : 'block rounded-md border border-stress-outline bg-base'}>
              <span
                className="block h-12 w-full rounded-md"
                style={{ background: `var(--color-${token.name}, ${token.value})` }}
              />
            </span>
          )
        case 'text':
          return (
            <span
              className="block truncate text-stress"
              style={declarationStyle(token.value)}
            >
              The quick brown fox
            </span>
          )
        case 'spacing':
          return (
            <span
              className="block h-3 rounded-sm bg-brand"
              style={{ width: `var(--spacing-${token.name}, ${token.value})` }}
            />
          )
        case 'radius':
          return (
            <span
              className="block size-12 border border-stress-outline bg-base stress-sm"
              style={{ borderRadius: `var(--radius-${token.name}, ${token.value})` }}
            />
          )
        case 'shadow':
          return (
            <span
              className="block size-12 rounded-md bg-base"
              style={{ boxShadow: `var(--shadow-${token.name}, ${token.value})` }}
            />
          )
        case 'layer':
        case 'motion':
          return null
      }
    })()}
    <figcaption className="flex min-w-0 flex-col">
      <span className="truncate text-subtitle2 text-stress">{token.name}</span>
      <span className="truncate font-mono text-caption text-stress-xl">{token.value}</span>
    </figcaption>
  </figure>
)

TokenSwatch.displayName = 'TokenSwatch'

const GalleryTokens = ({ tokens }: GalleryTokensProps) => {
  const { t } = useCopy()

  return (
    <div className="flex flex-col gap-8">
      {THEME_TOKEN_KINDS.map((kind) => (
        <section
          key={kind}
          aria-labelledby={`gallery-tokens-${kind}`}
          className="flex flex-col gap-3"
        >
          <h2
            id={`gallery-tokens-${kind}`}
            className="text-h5 text-stress"
          >
            {((): string => {
              switch (kind) {
                case 'color': return t('common.gallery.token.color')
                case 'stress': return t('common.gallery.token.stress')
                case 'text': return t('common.gallery.token.text')
                case 'spacing': return t('common.gallery.token.spacing')
                case 'radius': return t('common.gallery.token.radius')
                case 'shadow': return t('common.gallery.token.shadow')
                case 'layer': return t('common.gallery.token.layer')
                case 'motion': return t('common.gallery.token.motion')
              }
            })()}
          </h2>
          <div className={kind === 'text' ? 'flex flex-col gap-4' : 'grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4'}>
            {tokens[kind].map((token) => (
              <TokenSwatch
                key={token.name}
                kind={kind}
                token={token}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

GalleryTokens.displayName = 'GalleryTokens'

export { GalleryTokens }
export type { GalleryTokensProps }
