import { afterEach, describe, expect, it, vi } from 'vitest'

import { request } from '@/feature/service/request'

import { itemService } from './item.service'

vi.mock('@/feature/service/request', () => ({ request: vi.fn(() => Promise.resolve(undefined)) }))

const INPUT = { name: 'Example', status: 'active', description: '' } as const

describe('item service', () => {
  afterEach(() => {
    vi.mocked(request).mockClear()
  })

  it('reads the list and one item', async () => {
    await itemService['GET.Items']()
    await itemService['GET.Item']('a/b')
    expect(vi.mocked(request).mock.calls).toEqual([['/items'], ['/items/a%2Fb']])
  })

  it('creates, replaces and deletes an item', async () => {
    await itemService['POST.Item'](INPUT)
    await itemService['PUT.Item']({ id: 'item-1', input: INPUT })
    await itemService['DELETE.Item']('item-1')
    expect(vi.mocked(request).mock.calls).toEqual([
      ['/items', { method: 'POST', body: INPUT }],
      ['/items/item-1', { method: 'PUT', body: INPUT }],
      ['/items/item-1', { method: 'DELETE' }],
    ])
  })
})
