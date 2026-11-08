import { describe, expect, it } from 'vitest'

import { createItemMockService } from './item.mock'

const NOW = new Date('2026-03-01T12:00:00.000Z')

const createMock = () => createItemMockService({
  seed: [{ id: 'item-1', name: 'First', status: 'active', description: '', updatedAt: '2026-01-01T00:00:00.000Z' }],
  latencyMs: 0,
  now: () => NOW,
})

describe('item mock service', () => {
  it('creates, updates and deletes items in memory', async () => {
    const mock = createMock()

    const created = await mock['POST.Item']({ name: 'Second', status: 'draft', description: 'New' })
    expect(created).toEqual({ id: 'item-2', name: 'Second', status: 'draft', description: 'New', updatedAt: NOW.toISOString() })

    await expect(mock['PUT.Item']({ id: 'item-1', input: { name: 'First Renamed', status: 'paused', description: '' } }))
      .resolves.toEqual({ id: 'item-1', name: 'First Renamed', status: 'paused', description: '', updatedAt: NOW.toISOString() })

    await mock['DELETE.Item']('item-2')
    await expect(mock['GET.Items']()).resolves.toEqual([{ id: 'item-1', name: 'First Renamed', status: 'paused', description: '', updatedAt: NOW.toISOString() }])
  })

  it('refuses an id it does not hold as not found', async () => {
    const mock = createMock()

    await expect(mock['GET.Item']('item-9')).rejects.toMatchObject({ status: 404, body: { code: 'notFound' } })
    await expect(mock['DELETE.Item']('item-9')).rejects.toMatchObject({ status: 404 })
  })
})
