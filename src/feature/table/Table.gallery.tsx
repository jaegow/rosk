import { useState } from 'react'

import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Table } from './Table'
import type { TableSort } from './table.type'

type Example = {
  id: string
  name: string
  status: string
  count: number
}

const EXAMPLES: Example[] = [
  { id: '1', name: 'Example One', status: 'Open', count: 4 },
  { id: '2', name: 'Example Two', status: 'Closed', count: 12 },
  { id: '3', name: 'Example Three', status: 'Open', count: 0 },
]

const SortableExample = () => {
  const [sort, setSort] = useState<TableSort | undefined>({ key: 'name', direction: 'ascending' })
  const sorted = [...EXAMPLES].sort((a, b) => {
    const order = sort?.key === 'count' ? a.count - b.count : a.name.localeCompare(b.name)
    return sort?.direction === 'descending' ? -order : order
  })

  return (
    <Table
      label="Examples"
      rows={sorted}
      getRowId={(row) => row.id}
      sort={sort}
      onSort={setSort}
      columns={[
        { key: 'name', header: 'Name', cell: (row) => row.name, sortable: true },
        { key: 'status', header: 'Status', cell: (row) => row.status },
        { key: 'count', header: 'Notes', cell: (row) => row.count, align: 'end', sortable: true },
      ]}
      rowCTAs={(row) => (
        <Table.RowCTA
          iconOnly="edit"
          aria-label={`Edit ${row.name}`}
        />
      )}
    />
  )
}

SortableExample.displayName = 'SortableExample'

const gallery: GalleryEntry = {
  title: 'Table',
  group: 'composites',
  examples: [
    {
      name: 'Sortable with Row CTAs',
      render: () => <SortableExample />,
    },
    {
      name: 'Loading',
      render: () => (
        <Table
          label="Examples"
          status="pending"
          rows={[]}
          getRowId={(row: Example) => row.id}
          columns={[
            { key: 'name', header: 'Name', cell: (row) => row.name },
            { key: 'count', header: 'Notes', cell: (row) => row.count, align: 'end' },
          ]}
        />
      ),
    },
    {
      name: 'Empty and Failed',
      render: () => (
        <div className="flex w-full flex-col gap-6">
          <Table
            label="Examples"
            rows={[]}
            getRowId={(row: Example) => row.id}
            emptyMessage="No examples yet."
            columns={[{ key: 'name', header: 'Name', cell: (row) => row.name }]}
          />
          <Table
            label="Examples"
            status="error"
            rows={[]}
            getRowId={(row: Example) => row.id}
            columns={[{ key: 'name', header: 'Name', cell: (row) => row.name }]}
          />
        </div>
      ),
    },
  ],
}

export { gallery }
