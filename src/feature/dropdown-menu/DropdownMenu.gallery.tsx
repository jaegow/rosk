import { useState } from 'react'

import { CTA } from '@/feature/cta/CTA'
import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { DropdownMenu } from './DropdownMenu'

const ColumnsMenu = () => {
  const [shown, setShown] = useState({ name: true, status: true, updated: false })

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <CTA icon={{ start: 'filter', end: 'chevron-down' }}>Columns</CTA>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Show Columns</DropdownMenu.Label>
        <DropdownMenu.CheckboxItem
          checked={shown.name}
          onCheckedChange={(checked) => setShown({ ...shown, name: checked })}
        >
          Name
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem
          checked={shown.status}
          onCheckedChange={(checked) => setShown({ ...shown, status: checked })}
        >
          Status
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem
          checked={shown.updated}
          onCheckedChange={(checked) => setShown({ ...shown, updated: checked })}
        >
          Updated
        </DropdownMenu.CheckboxItem>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

ColumnsMenu.displayName = 'ColumnsMenu'

const gallery: GalleryEntry = {
  title: 'Dropdown Menu',
  group: 'primitives',
  examples: [
    {
      name: 'Items with Icons',
      render: () => (
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <CTA
              iconOnly="more-horizontal"
              aria-label="More for Item 4"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item icon="edit">Edit</DropdownMenu.Item>
            <DropdownMenu.Item icon="copy">Duplicate</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              icon="trash"
              variant="danger"
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      ),
    },
    {
      name: 'Labelled Checkbox Items',
      render: () => <ColumnsMenu />,
    },
  ],
}

export { gallery }
