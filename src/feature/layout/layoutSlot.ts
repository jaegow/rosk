import type { LayoutVariant } from './layout.type'

const LAYOUT_SLOT = {
  head: 'head',
  headTitle: 'head-title',
  headSubtitle: 'head-subtitle',
  headChip: 'head-chip',
  headCTAs: 'head-ctas',
  headCTA: 'head-cta',
  headTabs: 'head-tabs',
  headStatus: 'head-status',
  content: 'content',
  foot: 'foot',
  loadingBar: 'loading-bar',
} as const

type LayoutPart = keyof typeof LAYOUT_SLOT

const layoutSlot = <V extends LayoutVariant, P extends LayoutPart>(variant: V, part: P): `${V}-${(typeof LAYOUT_SLOT)[P]}` => `${variant}-${LAYOUT_SLOT[part]}`

export { LAYOUT_SLOT, layoutSlot }
export type { LayoutPart }
