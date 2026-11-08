import { describe, expect, it } from 'vitest'

import { columnSortState, nextSort, tableBodyState } from './table.util'

describe('nextSort', () => {
  it('sorts a new column ascending', () => {
    expect(nextSort(undefined, 'name')).toEqual({ key: 'name', direction: 'ascending' })
    expect(nextSort({ key: 'size', direction: 'descending' }, 'name')).toEqual({ key: 'name', direction: 'ascending' })
  })

  it('flips the sorted column between ascending and descending', () => {
    expect(nextSort({ key: 'name', direction: 'ascending' }, 'name')).toEqual({ key: 'name', direction: 'descending' })
    expect(nextSort({ key: 'name', direction: 'descending' }, 'name')).toEqual({ key: 'name', direction: 'ascending' })
  })
})

describe('columnSortState', () => {
  it('names the sorted column direction and none for the rest', () => {
    expect(columnSortState({ key: 'name', direction: 'descending' }, 'name')).toBe('descending')
    expect(columnSortState({ key: 'name', direction: 'descending' }, 'size')).toBe('none')
    expect(columnSortState(undefined, 'size')).toBe('none')
  })
})

describe('tableBodyState', () => {
  it('shows loading, failed, empty or rows from the read status and row count', () => {
    expect(tableBodyState('pending', 3)).toBe('loading')
    expect(tableBodyState('error', 3)).toBe('failed')
    expect(tableBodyState('success', 0)).toBe('empty')
    expect(tableBodyState('success', 2)).toBe('rows')
  })
})
