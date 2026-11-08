import { CTA } from '@/feature/cta/CTA'
import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { toast } from './toast.store'

const gallery: GalleryEntry = {
  title: 'Toast',
  group: 'primitives',
  examples: [
    {
      name: 'Severities',
      render: () => (
        <>
          <CTA onClick={() => toast.show({ severity: 'info', title: 'Item shared' })}>Show Info</CTA>
          <CTA onClick={() => toast.show({ severity: 'success', title: 'Item saved' })}>Show Success</CTA>
          <CTA onClick={() => toast.show({ severity: 'warning', title: 'Item is almost due' })}>Show Warning</CTA>
          <CTA onClick={() => toast.show({ severity: 'danger', title: 'Item could not be saved' })}>Show Error</CTA>
        </>
      ),
    },
    {
      name: 'Description and CTA',
      render: () => (
        <CTA
          onClick={() => toast.show({
            severity: 'success',
            title: 'Note deleted',
            description: 'The note was moved to the bin.',
            cta: { label: 'Undo', onPress: () => undefined },
          })}
        >
          Delete Note
        </CTA>
      ),
    },
  ],
}

export { gallery }
