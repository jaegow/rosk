import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { CTA } from './CTA'

const gallery: GalleryEntry = {
  title: 'CTA',
  group: 'primitives',
  examples: [
    {
      name: 'Variants',
      render: () => (
        <>
          <CTA variant="primary">Save Item</CTA>
          <CTA variant="secondary">Cancel</CTA>
          <CTA variant="tertiary">Learn More</CTA>
          <CTA variant="danger">Delete Item</CTA>
        </>
      ),
    },
    {
      name: 'Sizes',
      render: () => (
        <>
          <CTA size="sm">Small</CTA>
          <CTA size="md">Medium</CTA>
          <CTA size="lg">Large</CTA>
        </>
      ),
    },
    {
      name: 'Icons',
      render: () => (
        <>
          <CTA icon={{ start: 'plus' }}>Add Note</CTA>
          <CTA icon={{ end: 'arrow-right' }}>Continue</CTA>
          <CTA
            iconOnly="edit"
            aria-label="Edit Item"
          />
          <CTA
            variant="tertiary"
            iconOnly="trash"
            aria-label="Delete Item"
          />
        </>
      ),
    },
    {
      name: 'States',
      render: () => (
        <>
          <CTA
            variant="primary"
            loading
          >
            Saving
          </CTA>
          <CTA unavailable>Unavailable</CTA>
          <CTA href="#examples">Open Link</CTA>
        </>
      ),
    },
  ],
}

export { gallery }
