type LayoutVariant = 'card' | 'modal' | 'page'

type LayoutInset = 'none' | 'sm' | 'md' | 'lg'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

type LayoutFrame = {
  variant: LayoutVariant
  inset: LayoutInset
  titleLevel: HeadingLevel
  titleId?: string
  loading?: boolean
}

export type { HeadingLevel, LayoutFrame, LayoutInset, LayoutVariant }
