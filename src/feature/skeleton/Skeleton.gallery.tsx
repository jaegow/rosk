import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Skeleton } from './Skeleton'

const gallery: GalleryEntry = {
  title: 'Skeleton',
  group: 'primitives',
  examples: [
    {
      name: 'Text',
      render: () => (
        <div className="w-full max-w-md text-body1">
          <Skeleton>
            <Skeleton.Text lines={3} />
          </Skeleton>
        </div>
      ),
    },
    {
      name: 'Block',
      render: () => (
        <Skeleton label="Loading image">
          <Skeleton.Block
            height={8}
            width={12}
          />
        </Skeleton>
      ),
    },
    {
      name: 'Card Placeholder',
      render: () => (
        <div className="w-full max-w-md">
          <Skeleton>
            <div className="flex items-start gap-3">
              <Skeleton.Block
                height={3}
                width={3}
              />
              <div className="min-w-0 flex-1 text-body2">
                <Skeleton.Text lines={2} />
              </div>
            </div>
          </Skeleton>
        </div>
      ),
    },
  ],
}

export { gallery }
