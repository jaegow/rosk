import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Collapsible } from './Collapsible'

const gallery: GalleryEntry = {
  title: 'Collapsible',
  group: 'primitives',
  examples: [
    {
      name: 'Closed',
      render: () => (
        <div className="w-full max-w-md text-body2 text-stress">
          <Collapsible>
            <Collapsible.Trigger>More Details</Collapsible.Trigger>
            <Collapsible.Content>
              <p className="pt-2 text-stress-xxl">Details stay out of the way until asked for.</p>
            </Collapsible.Content>
          </Collapsible>
        </div>
      ),
    },
    {
      name: 'Open by Default',
      render: () => (
        <div className="w-full max-w-md text-body2 text-stress">
          <Collapsible defaultOpen>
            <Collapsible.Trigger>Summary</Collapsible.Trigger>
            <Collapsible.Content>
              <p className="pt-2 text-stress-xxl">This section starts open and folds away on press.</p>
            </Collapsible.Content>
          </Collapsible>
        </div>
      ),
    },
  ],
}

export { gallery }
