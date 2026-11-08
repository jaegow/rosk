type ItemStatus = 'draft' | 'active' | 'paused' | 'archived'

type Item = {
  id: string
  name: string
  status: ItemStatus
  description: string
  updatedAt: string
}

type ItemInput = Pick<Item, 'name' | 'status' | 'description'>

type ItemModel = ItemInput

type ItemSortKey = 'name' | 'status' | 'updatedAt'

type ItemService = {
  'GET.Items': () => Promise<Item[]>
  'GET.Item': (id: string) => Promise<Item>
  'POST.Item': (input: ItemInput) => Promise<Item>
  'PUT.Item': (args: { id: string, input: ItemInput }) => Promise<Item>
  'DELETE.Item': (id: string) => Promise<void>
}

export type { Item, ItemInput, ItemModel, ItemService, ItemSortKey, ItemStatus }
