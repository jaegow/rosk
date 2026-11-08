import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Icon } from './Icon'
import { ICON_PATHS, type IconName } from './icon.util'

const gallery: GalleryEntry = {
  title: 'Icon',
  group: 'primitives',
  examples: [
    {
      name: 'Registry',
      render: () => (Object.keys(ICON_PATHS) as IconName[]).map((name) => (
        <span
          key={name}
          className="flex w-24 flex-col items-center gap-1 text-caption text-stress-xl"
        >
          <span className="text-stress">
            <Icon name={name} />
          </span>
          {name}
        </span>
      )),
    },
    {
      name: 'Sizes',
      render: () => (
        <>
          <Icon
            name="settings"
            size="sm"
          />
          <Icon
            name="settings"
            size="md"
          />
          <Icon
            name="settings"
            size="lg"
          />
        </>
      ),
    },
    {
      name: 'Labelled',
      render: () => (
        <Icon
          name="warning"
          label="Needs Review"
        />
      ),
    },
  ],
}

export { gallery }
