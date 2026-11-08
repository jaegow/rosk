import { vi } from 'vitest'

import { createItemMockService, type ItemMockOptions } from '@/feature/example/item.mock'
import { itemService } from '@/feature/example/item.service'
import type { ItemService } from '@/feature/example/item.type'

const createItemsMock = (options: ItemMockOptions = {}): ItemService => createItemMockService({ latencyMs: 0, now: () => new Date('2026-03-01T12:00:00.000Z'), ...options })

const setup_GetItems = (mock = createItemsMock()) => ({ mock, spy: vi.spyOn(itemService, 'GET.Items').mockImplementation(() => mock['GET.Items']()) })

const setup_GetItem = (mock = createItemsMock()) => ({ mock, spy: vi.spyOn(itemService, 'GET.Item').mockImplementation((id) => mock['GET.Item'](id)) })

const setup_PostItem = (mock = createItemsMock()) => ({ mock, spy: vi.spyOn(itemService, 'POST.Item').mockImplementation((input) => mock['POST.Item'](input)) })

const setup_PutItem = (mock = createItemsMock()) => ({ mock, spy: vi.spyOn(itemService, 'PUT.Item').mockImplementation((args) => mock['PUT.Item'](args)) })

const setup_DeleteItem = (mock = createItemsMock()) => ({ mock, spy: vi.spyOn(itemService, 'DELETE.Item').mockImplementation((id) => mock['DELETE.Item'](id)) })

export { createItemsMock, setup_DeleteItem, setup_GetItem, setup_GetItems, setup_PostItem, setup_PutItem }
