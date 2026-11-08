import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Banner } from './Banner'

const gallery: GalleryEntry = {
  title: 'Banner',
  group: 'primitives',
  examples: [
    {
      name: 'Variants',
      render: () => (
        <div className="flex w-full flex-col gap-3">
          <Banner message="A new version is available." />
          <Banner
            variant="warning"
            message="Scheduled maintenance starts in one hour."
          />
        </div>
      ),
    },
    {
      name: 'Dismissible',
      render: () => (
        <div className="w-full">
          <Banner
            message="You are viewing an example workspace."
            onDismiss={() => undefined}
          />
        </div>
      ),
    },
    {
      name: 'With CTA',
      render: () => (
        <div className="w-full">
          <Banner
            variant="warning"
            message="Your session ends soon."
            onDismiss={() => undefined}
          >
            <Banner.CTA>Stay Signed In</Banner.CTA>
          </Banner>
        </div>
      ),
    },
  ],
}

export { gallery }
