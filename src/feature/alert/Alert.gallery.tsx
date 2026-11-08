import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Alert } from './Alert'

const gallery: GalleryEntry = {
  title: 'Alert',
  group: 'primitives',
  examples: [
    {
      name: 'Severities',
      render: () => (
        <div className="flex w-full flex-col gap-3">
          <Alert
            severity="info"
            message="Changes save as you type."
          />
          <Alert
            severity="success"
            message="The item was saved."
          />
          <Alert
            severity="warning"
            message="This item has not been reviewed yet."
          />
          <Alert
            severity="danger"
            message="The item could not be saved."
          />
        </div>
      ),
    },
    {
      name: 'Title and Message',
      render: () => (
        <div className="w-full">
          <Alert
            severity="warning"
            title="Review Needed"
            message="Two notes on this item changed since you last opened it."
          />
        </div>
      ),
    },
    {
      name: 'With CTAs',
      render: () => (
        <div className="w-full">
          <Alert
            severity="danger"
            title="Save Failed"
            message="The connection dropped before the save finished."
          >
            <Alert.CTA>Try Again</Alert.CTA>
          </Alert>
        </div>
      ),
    },
  ],
}

export { gallery }
