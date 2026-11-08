import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Divider } from './Divider'

const gallery: GalleryEntry = {
  title: 'Divider',
  group: 'primitives',
  examples: [
    {
      name: 'Horizontal',
      render: () => (
        <div className="flex w-full flex-col gap-3 text-body2 text-stress">
          <p>First section</p>
          <Divider />
          <p>Second section</p>
        </div>
      ),
    },
    {
      name: 'Inset',
      render: () => (
        <div className="flex w-full flex-col gap-3 rounded-md border border-stress-outline py-inset text-body2 text-stress">
          <p className="px-inset">Above the inset rule</p>
          <Divider inset />
          <p className="px-inset">Below the inset rule</p>
        </div>
      ),
    },
    {
      name: 'Vertical',
      render: () => (
        <div className="flex h-8 items-center gap-3 text-body2 text-stress">
          <span>Left</span>
          <Divider orientation="vertical" />
          <span>Right</span>
        </div>
      ),
    },
  ],
}

export { gallery }
