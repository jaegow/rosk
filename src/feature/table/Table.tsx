import type { ReactNode } from 'react'

import { useCopy } from '@/feature/copy/useCopy'
import { CTA } from '@/feature/cta/CTA'
import type { CTAPlacedProps } from '@/feature/cta/cta.type'
import { Skeleton } from '@/feature/skeleton/Skeleton'
import { cn } from '@/style/cn'

import type { TableAlign, TableColumn, TableSort, TableStatus } from './table.type'
import { columnSortState, nextSort, tableBodyState } from './table.util'
import { TABLE_SLOT } from './tableSlot'

type TableProps<Row extends Record<string, unknown>> = {
  label: string
  columns: readonly TableColumn<Row>[]
  rows: readonly Row[]
  getRowId: (row: Row) => string
  status?: TableStatus
  sort?: TableSort
  onSort?: (sort: TableSort) => void
  rowCTAs?: (row: Row) => ReactNode
  emptyMessage?: string
}

const TableRoot = <Row extends Record<string, unknown>>({ label, columns, rows, getRowId, status = 'success', sort, onSort, rowCTAs, emptyMessage }: TableProps<Row>) => {
  const { t } = useCopy()
  const bodyState = tableBodyState(status, rows.length)
  const columnCount = columns.length + (rowCTAs === undefined ? 0 : 1)

  return (
    <div
      data-slot={TABLE_SLOT.root}
      className="min-w-0 overflow-x-auto"
    >
      <table className="w-full border-collapse text-body2 text-stress">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                data-slot={TABLE_SLOT.headCell}
                scope="col"
                aria-sort={column.sortable === true && onSort !== undefined ? columnSortState(sort, column.key) : undefined}
                className={cn('h-10 border-b border-stress-outline px-3 align-bottom text-subtitle2 whitespace-nowrap text-stress-xxl', ({
                  start: 'text-start',
                  center: 'text-center',
                  end: 'text-end',
                } satisfies Record<TableAlign, string>)[column.align ?? 'start'])}
              >
                {column.sortable === true && onSort !== undefined
                  ? (
                    <CTA
                      data-slot={TABLE_SLOT.headCTA}
                      variant="tertiary"
                      size="sm"
                      icon={{
                        end: ((): 'sort' | 'chevron-up' | 'chevron-down' => {
                          switch (columnSortState(sort, column.key)) {
                            case 'ascending': return 'chevron-up'
                            case 'descending': return 'chevron-down'
                            case 'none': return 'sort'
                          }
                        })(),
                      }}
                      onClick={() => onSort(nextSort(sort, column.key))}
                    >
                      {column.header}
                    </CTA>
                  )
                  : column.header}
              </th>
            ))}
            {rowCTAs !== undefined && (
              <th
                data-slot={TABLE_SLOT.headCell}
                scope="col"
                className="sticky end-0 h-10 w-0 border-b border-stress-outline bg-base px-3"
              >
                <span className="sr-only">{t('common.table.rowCTAs')}</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody aria-busy={bodyState === 'loading' || undefined}>
          {((): ReactNode => {
            switch (bodyState) {
              case 'loading': return [0, 1, 2].map((index) => (
                <tr
                  key={index}
                  data-slot={TABLE_SLOT.row}
                >
                  {columns.map((column, columnIndex) => (
                    <td
                      key={column.key}
                      data-slot={TABLE_SLOT.cell}
                      className="h-10 border-b border-stress-outline px-3"
                    >
                      {index === 0 && columnIndex === 0
                        ? <Skeleton><Skeleton.Text /></Skeleton>
                        : <Skeleton.Text />}
                    </td>
                  ))}
                  {rowCTAs !== undefined && <td className="h-10 border-b border-stress-outline px-3" />}
                </tr>
              ))
              case 'failed': return (
                <tr data-slot={TABLE_SLOT.row}>
                  <td
                    data-slot={TABLE_SLOT.message}
                    colSpan={columnCount}
                    className="px-3 py-6 text-center text-stress-xxl"
                  >
                    {t('common.table.failed')}
                  </td>
                </tr>
              )
              case 'empty': return (
                <tr data-slot={TABLE_SLOT.row}>
                  <td
                    data-slot={TABLE_SLOT.message}
                    colSpan={columnCount}
                    className="px-3 py-6 text-center text-stress-xxl"
                  >
                    {emptyMessage ?? t('common.table.empty')}
                  </td>
                </tr>
              )
              case 'rows': return rows.map((row) => (
                <tr
                  key={getRowId(row)}
                  data-slot={TABLE_SLOT.row}
                  className="hover:stress-hover"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      data-slot={TABLE_SLOT.cell}
                      className={cn('h-10 border-b border-stress-outline px-3 whitespace-nowrap', ({
                        start: 'text-start',
                        center: 'text-center',
                        end: 'text-end tabular-nums',
                      } satisfies Record<TableAlign, string>)[column.align ?? 'start'])}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                  {rowCTAs !== undefined && (
                    <td
                      data-slot={TABLE_SLOT.rowCTAs}
                      className="sticky end-0 h-10 w-0 border-b border-stress-outline bg-base px-3 whitespace-nowrap"
                    >
                      <div className="flex items-center justify-center gap-1">{rowCTAs(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            }
          })()}
        </tbody>
      </table>
    </div>
  )
}

TableRoot.displayName = 'Table'

const TableRowCTA = (props: CTAPlacedProps) => (
  <CTA
    data-slot={TABLE_SLOT.rowCTA}
    variant="tertiary"
    size="sm"
    {...props}
  />
)

TableRowCTA.displayName = 'Table.RowCTA'

const Table = Object.assign(TableRoot, {
  RowCTA: TableRowCTA,
})

export { Table }
export type { TableProps }
