import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { EmptyState } from './EmptyState'

const gallery: GalleryEntry = {
  title: 'Empty State',
  group: 'composites',
  examples: [
    {
      name: 'Title and Message',
      render: () => (
        <div className="w-full max-w-md">
          <EmptyState
            title="No Notes Yet"
            message="Notes added to this item show here."
          />
        </div>
      ),
    },
    {
      name: 'With Icon and CTA',
      render: () => (
        <div className="w-full max-w-md">
          <EmptyState
            icon="error"
            title="Notes Could Not Load"
            message="Something stopped the notes from loading."
          >
            <EmptyState.CTA>Try Again</EmptyState.CTA>
          </EmptyState>
        </div>
      ),
    },
    {
      name: 'Nothing Matches',
      render: () => (
        <div className="w-full max-w-md">
          <EmptyState
            icon="search"
            title="Nothing Matches"
            message="Try a different search."
          />
        </div>
      ),
    },
  ],
}

export { gallery }
