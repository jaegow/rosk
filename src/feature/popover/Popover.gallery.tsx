import { CTA } from '@/feature/cta/CTA'
import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { OverlaySurface } from './OverlaySurface'
import { Popover } from './Popover'

const gallery: GalleryEntry = {
  title: 'Popover',
  group: 'primitives',
  examples: [
    {
      name: 'With Close',
      render: () => (
        <Popover>
          <Popover.Trigger asChild>
            <CTA icon={{ end: 'chevron-down' }}>Show Details</CTA>
          </Popover.Trigger>
          <Popover.Content align="start">
            <div className="flex items-start gap-3">
              <p className="max-w-xs">A popover holds a short read or a small control beside its trigger.</p>
              <Popover.Close />
            </div>
          </Popover.Content>
        </Popover>
      ),
    },
    {
      name: 'Overlay Surfaces',
      render: () => (
        <>
          <OverlaySurface layer="popover">Popover surface</OverlaySurface>
          <OverlaySurface
            layer="tooltip"
            density="sm"
          >
            Tooltip surface
          </OverlaySurface>
        </>
      ),
    },
  ],
}

export { gallery }
