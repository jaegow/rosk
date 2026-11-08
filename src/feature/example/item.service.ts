import { isMockMode } from '@/feature/service/mockMode'
import { request } from '@/feature/service/request'

import { createItemMockService } from './item.mock'
import type { Item, ItemService } from './item.type'

const itemPath = (id: string) => `/items/${encodeURIComponent(id)}`

const httpItemService: ItemService = {
  'GET.Items': () => request<Item[]>('/items'),
  'GET.Item': (id) => request<Item>(itemPath(id)),
  'POST.Item': (input) => request<Item>('/items', { method: 'POST', body: input }),
  'PUT.Item': (args) => request<Item>(itemPath(args.id), { method: 'PUT', body: args.input }),
  'DELETE.Item': (id) => request<void>(itemPath(id), { method: 'DELETE' }),
}

const itemService: ItemService = import.meta.env.DEV && isMockMode(import.meta.env) ? createItemMockService() : httpItemService

export { itemService }
