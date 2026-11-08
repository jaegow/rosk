import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { CTABar } from './CTABar'

const gallery: GalleryEntry = {
  title: 'CTA Bar',
  group: 'primitives',
  examples: [
    {
      name: 'Three Lanes',
      render: () => (
        <div className="w-full">
          <CTABar>
            <CTABar.CTA
              lane="primary"
              variant="primary"
            >
              Save Item
            </CTABar.CTA>
            <CTABar.CTA lane="secondary">Cancel</CTABar.CTA>
            <CTABar.CTA
              lane="tertiary"
              variant="tertiary"
            >
              Reset
            </CTABar.CTA>
          </CTABar>
        </div>
      ),
    },
    {
      name: 'Closing Lane Only',
      render: () => (
        <div className="w-full">
          <CTABar>
            <CTABar.CTA
              lane="primary"
              variant="primary"
            >
              Confirm
            </CTABar.CTA>
            <CTABar.CTA lane="secondary">Back</CTABar.CTA>
          </CTABar>
        </div>
      ),
    },
  ],
}

export { gallery }
