import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Info } from './Info'

const gallery: GalleryEntry = {
  title: 'Info',
  group: 'primitives',
  examples: [
    {
      name: 'Beside a Label',
      render: () => (
        <span className="inline-flex items-center gap-1 text-subtitle2 text-stress">
          Due Date
          <Info label="About Due Date">The date the item must be finished by.</Info>
        </span>
      ),
    },
    {
      name: 'Inline in Text',
      render: () => (
        <p className="inline-flex items-center gap-1 text-body2 text-stress-xxl">
          Totals refresh every few minutes
          <Info label="About Totals">Press it to pin the explanation open on touch screens.</Info>
        </p>
      ),
    },
  ],
}

export { gallery }
