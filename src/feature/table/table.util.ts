import type { TableBodyState, TableSort, TableStatus } from './table.type'

const nextSort = (current: TableSort | undefined, key: string): TableSort => (
  current?.key === key && current.direction === 'ascending'
    ? { key, direction: 'descending' }
    : { key, direction: 'ascending' }
)

const columnSortState = (sort: TableSort | undefined, key: string): TableSort['direction'] | 'none' => (
  sort?.key === key ? sort.direction : 'none'
)

const tableBodyState = (status: TableStatus, rowCount: number): TableBodyState => {
  if (status === 'pending') return 'loading'
  if (status === 'error') return 'failed'
  return rowCount === 0 ? 'empty' : 'rows'
}

export { columnSortState, nextSort, tableBodyState }
