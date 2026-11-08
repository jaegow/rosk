import type { CTALane, CTASize, CTAVariant } from '@/feature/cta/cta.type'

import type { HeadingLevel, LayoutVariant } from './layout.type'

const nextHeadingLevel = (level: HeadingLevel): HeadingLevel => ({ 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 6 } as const satisfies Record<HeadingLevel, HeadingLevel>)[level]

const footCTAVariant = (variant: LayoutVariant, lane: CTALane): CTAVariant => {
  switch (lane) {
    case 'tertiary': return 'tertiary'
    case 'secondary': return 'secondary'
    case 'primary': return variant === 'card' ? 'secondary' : 'primary'
  }
}

const footCTASize = (variant: LayoutVariant): CTASize => (variant === 'card' ? 'sm' : 'md')

export { footCTASize, footCTAVariant, nextHeadingLevel }
