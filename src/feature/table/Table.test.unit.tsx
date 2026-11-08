import { within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/testing/render.unit'

import { Table } from './Table'
import type { TableSort, TableStatus } from './table.type'

type Item = {
  id: string
  name: string
  size: number
}

const ITEMS: Item[] = [
  { id: 'a', name: 'Alpha', size: 3 },
  { id: 'b', name: 'Beta', size: 12 },
]

const ItemTable = ({ rows = ITEMS, status, onEdit = () => undefined }: { rows?: Item[], status?: TableStatus, onEdit?: (item: Item) => void }) => {
  const [sort, setSort] = useState<TableSort | undefined>(undefined)

  return (
    <Table
      label="Items"
      rows={rows}
      status={status}
      getRowId={(item) => item.id}
      sort={sort}
      onSort={setSort}
      columns={[
        { key: 'name', header: 'Name', cell: (item) => item.name, sortable: true },
        { key: 'size', header: 'Size', cell: (item) => item.size, align: 'end' },
      ]}
      rowCTAs={(item) => (
        <Table.RowCTA
          iconOnly="edit"
          aria-label={`Edit ${item.name}`}
          onClick={() => onEdit(item)}
        />
      )}
    />
  )
}

describe('Table', () => {
  it('renders a header per column and a row per record, with a row CTA naming its row', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const view = renderWithProviders(<ItemTable onEdit={onEdit} />)

    const table = view.getByRole('table', { name: 'Items' })
    expect(within(table).getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['Name', 'Size', 'Actions'])
    expect(within(table).getAllByRole('row').slice(1).map((row) => within(row).getAllByRole('cell').slice(0, 2).map((cell) => cell.textContent))).toEqual([['Alpha', '3'], ['Beta', '12']])

    await user.click(view.getByRole('button', { name: 'Edit Beta' }))
    expect(onEdit).toHaveBeenCalledWith({ id: 'b', name: 'Beta', size: 12 })
  })

  it('announces the sort state on a sortable header as its CTA flips it', async () => {
    const user = userEvent.setup()
    const view = renderWithProviders(<ItemTable />)

    const name = view.getByRole('columnheader', { name: 'Name' })
    expect(name).toHaveAttribute('aria-sort', 'none')
    expect(view.getByRole('columnheader', { name: 'Size' })).not.toHaveAttribute('aria-sort')

    await user.click(within(name).getByRole('button', { name: 'Name' }))
    expect(name).toHaveAttribute('aria-sort', 'ascending')

    await user.click(within(name).getByRole('button', { name: 'Name' }))
    expect(name).toHaveAttribute('aria-sort', 'descending')
  })

  it('says there is nothing yet when there are no rows', () => {
    const view = renderWithProviders(<ItemTable rows={[]} />)
    expect(view.getByRole('cell', { name: 'Nothing to show yet.' })).toBeInTheDocument()
  })

  it('shows loading rows in its body while the read is pending', () => {
    const view = renderWithProviders(<ItemTable status="pending" />)

    expect(view.getByRole('status', { name: 'Loading…' })).toBeInTheDocument()
    expect(view.queryByText('Alpha')).toBeNull()
  })

  it('says its rows could not load when the read failed', () => {
    const view = renderWithProviders(<ItemTable status="error" />)
    expect(view.getByRole('cell', { name: 'These rows could not load.' })).toBeInTheDocument()
  })
})
