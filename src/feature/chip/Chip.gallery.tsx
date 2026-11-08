import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Chip } from './Chip'

const gallery: GalleryEntry = {
  title: 'Chip',
  group: 'primitives',
  examples: [
    {
      name: 'Statuses',
      render: () => (
        <>
          <Chip label="Draft" />
          <Chip
            label="In Review"
            status="info"
          />
          <Chip
            label="Done"
            status="success"
          />
          <Chip
            label="Due Soon"
            status="warning"
          />
          <Chip
            label="Failed"
            status="danger"
          />
        </>
      ),
    },
    {
      name: 'With Count',
      render: () => (
        <>
          <Chip
            label="Notes"
            count={3}
          />
          <Chip
            label="Open"
            status="info"
            count={128}
          />
        </>
      ),
    },
    {
      name: 'Removable',
      render: () => (
        <>
          <Chip
            label="Example Filter"
            onRemove={() => undefined}
          />
          <Chip
            label="Urgent"
            status="danger"
            onRemove={() => undefined}
          />
        </>
      ),
    },
  ],
}

export { gallery }
