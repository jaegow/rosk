import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { SideIndicator } from './SideIndicator'

const gallery: GalleryEntry = {
  title: 'Side Indicator',
  group: 'primitives',
  examples: [
    {
      name: 'Variants',
      render: () => (
        <div className="flex w-full flex-col gap-2">
          <div className="relative rounded-sm border border-stress-outline p-inset text-body2 text-stress">
            <SideIndicator variant="neutral" />
            Neutral
          </div>
          <div className="relative rounded-sm border border-stress-outline p-inset text-body2 text-stress">
            <SideIndicator variant="info" />
            Info
          </div>
          <div className="relative rounded-sm border border-stress-outline p-inset text-body2 text-stress">
            <SideIndicator variant="success" />
            Success
          </div>
          <div className="relative rounded-sm border border-stress-outline p-inset text-body2 text-stress">
            <SideIndicator variant="warning" />
            Warning
          </div>
          <div className="relative rounded-sm border border-stress-outline p-inset text-body2 text-stress">
            <SideIndicator variant="danger" />
            Danger
          </div>
        </div>
      ),
    },
    {
      name: 'Enclosing Box Owns the Line',
      render: () => (
        <div className="relative flex w-full flex-col gap-2 rounded-sm border border-stress-outline p-inset text-body2 text-stress">
          <SideIndicator variant="warning" />
          <SideIndicator.Enclosing>
            <div className="relative ps-3">
              <SideIndicator variant="danger" />
              Inner row draws no line of its own
            </div>
          </SideIndicator.Enclosing>
        </div>
      ),
    },
  ],
}

export { gallery }
