import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Spinner } from './Spinner'

const gallery: GalleryEntry = {
  title: 'Spinner',
  group: 'primitives',
  examples: [
    {
      name: 'Sizes',
      render: () => (
        <>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </>
      ),
    },
    {
      name: 'Labelled',
      render: () => <Spinner label="Loading notes" />,
    },
    {
      name: 'Inherits Ink',
      render: () => (
        <span className="inline-flex items-center gap-2 text-body2 text-stress-xl">
          <Spinner size="sm" />
          Fetching items
        </span>
      ),
    },
  ],
}

export { gallery }
