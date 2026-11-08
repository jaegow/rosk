import type { ChipStatus } from '@/feature/chip/Chip'
import type { TableSort } from '@/feature/table/table.type'

import type { Item, ItemInput, ItemModel, ItemSortKey, ItemStatus } from './item.type'

const ITEM_STATUSES = ['draft', 'active', 'paused', 'archived'] as const satisfies readonly ItemStatus[]

const ITEM_SORT_KEYS = ['name', 'status', 'updatedAt'] as const satisfies readonly ItemSortKey[]

const ITEM_PARAM = { open: 'item', sort: 'sort', order: 'order' } as const

const NEW_ITEM = 'new'

const DEFAULT_ITEM_SORT: TableSort = { key: 'name', direction: 'ascending' }

const itemChipStatus = (status: ItemStatus): ChipStatus => ({
  draft: 'neutral',
  active: 'success',
  paused: 'warning',
  archived: 'info',
} as const satisfies Record<ItemStatus, ChipStatus>)[status]

const itemSort = (params: URLSearchParams): TableSort => {
  const key = ITEM_SORT_KEYS.find((candidate) => candidate === params.get(ITEM_PARAM.sort))
  if (key === undefined) return DEFAULT_ITEM_SORT
  return { key, direction: params.get(ITEM_PARAM.order) === 'descending' ? 'descending' : 'ascending' }
}

const withItemSort = (params: URLSearchParams, sort: TableSort): URLSearchParams => {
  const next = new URLSearchParams(params)
  next.set(ITEM_PARAM.sort, sort.key)
  next.set(ITEM_PARAM.order, sort.direction)
  return next
}

const withOpenItem = (params: URLSearchParams, id: string | null): URLSearchParams => {
  const next = new URLSearchParams(params)
  if (id === null) next.delete(ITEM_PARAM.open)
  else next.set(ITEM_PARAM.open, id)
  return next
}

const sortItems = (items: readonly Item[], sort: TableSort): Item[] => {
  const order = sort.direction === 'descending' ? -1 : 1
  return items.toSorted((left, right) => {
    const compared = ((): number => {
      switch (sort.key) {
        case 'status': return ITEM_STATUSES.indexOf(left.status) - ITEM_STATUSES.indexOf(right.status)
        case 'updatedAt': return left.updatedAt.localeCompare(right.updatedAt)
        default: return left.name.localeCompare(right.name)
      }
    })()
    return compared === 0 ? left.id.localeCompare(right.id) : compared * order
  })
}

const itemModel = (item: Item | undefined): ItemModel => ({
  name: item?.name ?? '',
  status: item?.status ?? 'draft',
  description: item?.description ?? '',
})

const itemInput = (model: ItemModel): ItemInput => ({
  name: model.name.trim(),
  status: model.status,
  description: model.description.trim(),
})

export { DEFAULT_ITEM_SORT, ITEM_PARAM, ITEM_SORT_KEYS, ITEM_STATUSES, itemChipStatus, itemInput, itemModel, itemSort, NEW_ITEM, sortItems, withItemSort, withOpenItem }
