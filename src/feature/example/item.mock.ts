import { ServiceError } from '@/feature/service/serviceError'

import type { Item, ItemService } from './item.type'

const ITEM_SEED: readonly Item[] = [
  { id: 'item-1', name: 'First Example', status: 'active', description: 'A record the list shows on first load.', updatedAt: '2026-01-12T09:30:00.000Z' },
  { id: 'item-2', name: 'Second Example', status: 'draft', description: '', updatedAt: '2026-02-03T14:05:00.000Z' },
  { id: 'item-3', name: 'Third Example', status: 'paused', description: 'Waiting on something else.', updatedAt: '2026-02-20T16:45:00.000Z' },
  { id: 'item-4', name: 'Fourth Example', status: 'archived', description: 'Kept for reference.', updatedAt: '2025-11-28T08:00:00.000Z' },
]

type ItemMockOptions = {
  seed?: readonly Item[]
  latencyMs?: number
  now?: () => Date
}

const createItemMockService = ({ seed = ITEM_SEED, latencyMs = 250, now = () => new Date() }: ItemMockOptions = {}): ItemService => {
  const store = { items: seed.map((item) => ({ ...item })), sequence: seed.length }

  const settle = <T>(answer: () => T): Promise<T> => new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(structuredClone(answer()))
      } catch (error) {
        reject(error)
      }
    }, latencyMs)
  })

  const find = (id: string): Item => {
    const item = store.items.find((candidate) => candidate.id === id)
    if (item === undefined) throw new ServiceError(404, { code: 'notFound' })
    return item
  }

  return {
    'GET.Items': () => settle(() => store.items),
    'GET.Item': (id) => settle(() => find(id)),
    'POST.Item': (input) => settle(() => {
      store.sequence += 1
      const item: Item = { ...input, id: `item-${store.sequence}`, updatedAt: now().toISOString() }
      store.items = [...store.items, item]
      return item
    }),
    'PUT.Item': (args) => settle(() => {
      const item: Item = { ...find(args.id), ...args.input, updatedAt: now().toISOString() }
      store.items = store.items.map((candidate) => (candidate.id === args.id ? item : candidate))
      return item
    }),
    'DELETE.Item': (id) => settle(() => {
      find(id)
      store.items = store.items.filter((candidate) => candidate.id !== id)
    }),
  }
}

export { createItemMockService, ITEM_SEED }
export type { ItemMockOptions }
