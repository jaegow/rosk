import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { CountBadge } from './CountBadge'

const gallery: GalleryEntry = {
  title: 'Count Badge',
  group: 'primitives',
  examples: [
    {
      name: 'Counts',
      render: () => (
        <>
          <CountBadge count={0} />
          <CountBadge count={7} />
          <CountBadge count={42} />
        </>
      ),
    },
    {
      name: 'Capped',
      render: () => (
        <>
          <CountBadge count={99} />
          <CountBadge count={100} />
          <CountBadge count={12000} />
        </>
      ),
    },
  ],
}

export { gallery }
