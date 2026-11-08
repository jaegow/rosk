import type { ReactNode } from 'react'

type TableAlign = 'start' | 'center' | 'end'

type TableColumn<Row> = {
  key: string
  header: string
  cell: (row: Row) => ReactNode
  align?: TableAlign
  sortable?: boolean
}

type TableSortDirection = 'ascending' | 'descending'

type TableSort = {
  key: string
  direction: TableSortDirection
}

type TableStatus = 'pending' | 'error' | 'success'

type TableBodyState = 'loading' | 'failed' | 'empty' | 'rows'

export type { TableAlign, TableBodyState, TableColumn, TableSort, TableSortDirection, TableStatus }
