import { CTA } from '@/feature/cta/CTA'
import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Tooltip } from './Tooltip'

const gallery: GalleryEntry = {
  title: 'Tooltip',
  group: 'primitives',
  examples: [
    {
      name: 'Label Shorthand',
      render: () => (
        <Tooltip label="Copies the link to your clipboard">
          <CTA>Copy Link</CTA>
        </Tooltip>
      ),
    },
    {
      name: 'Icon-Only CTA',
      render: () => (
        <CTA
          iconOnly="copy"
          aria-label="Copy Link"
        />
      ),
    },
    {
      name: 'Composed Parts',
      render: () => (
        <Tooltip>
          <Tooltip.Trigger asChild>
            <CTA variant="tertiary">Hover or Focus</CTA>
          </Tooltip.Trigger>
          <Tooltip.Content side="right">Shown beside its trigger</Tooltip.Content>
        </Tooltip>
      ),
    },
  ],
}

export { gallery }
