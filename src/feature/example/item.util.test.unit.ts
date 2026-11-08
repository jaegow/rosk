import { describe, expect, it } from 'vitest'

import type { Item } from './item.type'
import { itemChipStatus, itemInput, itemModel, itemSort, sortItems, withItemSort, withOpenItem } from './item.util'

const item = (id: string, name: string, status: Item['status'], updatedAt: string): Item => ({ id, name, status, description: '', updatedAt })

const ITEMS = [
  item('a', 'Beta', 'paused', '2026-02-01T00:00:00.000Z'),
  item('b', 'Alpha', 'active', '2026-03-01T00:00:00.000Z'),
  item('c', 'Alpha', 'draft', '2026-01-01T00:00:00.000Z'),
]

describe('itemChipStatus', () => {
  it('maps each item status onto a chip status', () => {
    expect((['draft', 'active', 'paused', 'archived'] as const).map(itemChipStatus)).toEqual(['neutral', 'success', 'warning', 'info'])
  })
})

describe('item sort', () => {
  it('reads the sort from the URL and falls back to name ascending', () => {
    expect(itemSort(new URLSearchParams('sort=updatedAt&order=descending'))).toEqual({ key: 'updatedAt', direction: 'descending' })
    expect(itemSort(new URLSearchParams('sort=status'))).toEqual({ key: 'status', direction: 'ascending' })
    expect(itemSort(new URLSearchParams('sort=unknown&order=descending'))).toEqual({ key: 'name', direction: 'ascending' })
  })

  it('writes the sort into the URL beside the params already there', () => {
    expect(withItemSort(new URLSearchParams('item=a'), { key: 'status', direction: 'descending' }).toString()).toBe('item=a&sort=status&order=descending')
  })

  it('orders by the chosen column, breaking ties by id', () => {
    expect(sortItems(ITEMS, { key: 'name', direction: 'ascending' }).map((each) => each.id)).toEqual(['b', 'c', 'a'])
    expect(sortItems(ITEMS, { key: 'name', direction: 'descending' }).map((each) => each.id)).toEqual(['a', 'b', 'c'])
    expect(sortItems(ITEMS, { key: 'status', direction: 'ascending' }).map((each) => each.id)).toEqual(['c', 'b', 'a'])
    expect(sortItems(ITEMS, { key: 'updatedAt', direction: 'descending' }).map((each) => each.id)).toEqual(['b', 'a', 'c'])
  })
})

describe('withOpenItem', () => {
  it('names the open item in the URL and clears it on close', () => {
    expect(withOpenItem(new URLSearchParams('sort=name'), 'a').toString()).toBe('sort=name&item=a')
    expect(withOpenItem(new URLSearchParams('sort=name&item=a'), null).toString()).toBe('sort=name')
  })
})

describe('item model', () => {
  it('starts a create blank as a draft', () => {
    expect(itemModel(undefined)).toEqual({ name: '', status: 'draft', description: '' })
  })

  it('maps a record to its model and a model to its payload', () => {
    expect(itemModel({ ...item('a', 'Beta', 'paused', '2026-02-01T00:00:00.000Z'), description: 'Notes' })).toEqual({ name: 'Beta', status: 'paused', description: 'Notes' })
    expect(itemInput({ name: '  Beta ', status: 'active', description: ' Notes ' })).toEqual({ name: 'Beta', status: 'active', description: 'Notes' })
  })
})
