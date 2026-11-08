import type { ReactNode } from 'react'

type GalleryGroup = 'primitives' | 'composites' | 'form' | 'patterns'

type GalleryExample = {
  name: string
  render: () => ReactNode
}

type GalleryEntry = {
  title: string
  group: GalleryGroup
  examples: readonly GalleryExample[]
}

export type { GalleryEntry, GalleryExample, GalleryGroup }
