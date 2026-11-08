import { QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { createTestQueryClient } from '@/feature/app/App.queryClient'
import { createItemsMock, setup_DeleteItem, setup_GetItem, setup_GetItems, setup_PutItem } from '@/testing/helpers/setup.items'

import { useItem } from './useItem'

const renderItemHooks = () => {
  const queryClient = createTestQueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => createElement(QueryClientProvider, { client: queryClient }, children)
  const onSuccess = vi.fn()
  const hook = renderHook(() => ({
    list: useItem.query.useGetItems(),
    detail: useItem.query.useGetItem('item-1'),
    put: useItem.mutate.usePutItem({ onSuccess }),
    remove: useItem.mutate.useDeleteItem(),
  }), { wrapper })
  return { hook, onSuccess, queryClient }
}

describe('useItem', () => {
  it('merges a saved item into its detail cache and refetches the list', async () => {
    const mock = createItemsMock()
    const list = setup_GetItems(mock)
    setup_GetItem(mock)
    const put = setup_PutItem(mock)
    const rendered = renderItemHooks()
    await waitFor(() => expect(rendered.hook.result.current.detail.data?.name).toBe('First Example'))
    expect(list.spy).toHaveBeenCalledTimes(1)

    act(() => rendered.hook.result.current.put.mutate({ id: 'item-1', input: { name: 'Renamed', status: 'paused', description: '' } }))

    await waitFor(() => expect(rendered.hook.result.current.detail.data?.name).toBe('Renamed'))
    expect(put.spy).toHaveBeenCalledWith({ id: 'item-1', input: { name: 'Renamed', status: 'paused', description: '' } })
    expect(rendered.onSuccess).toHaveBeenCalledWith({ id: 'item-1', name: 'Renamed', status: 'paused', description: '', updatedAt: '2026-03-01T12:00:00.000Z' })
    await waitFor(() => expect(list.spy).toHaveBeenCalledTimes(2))
    expect(rendered.hook.result.current.list.data?.find((item) => item.id === 'item-1')?.name).toBe('Renamed')
  })

  it('drops a deleted item from the list on refetch', async () => {
    const mock = createItemsMock()
    setup_GetItems(mock)
    setup_GetItem(mock)
    const remove = setup_DeleteItem(mock)
    const rendered = renderItemHooks()
    await waitFor(() => expect(rendered.hook.result.current.list.data).toHaveLength(4))

    act(() => rendered.hook.result.current.remove.mutate('item-2'))

    await waitFor(() => expect(rendered.hook.result.current.list.data).toHaveLength(3))
    expect(remove.spy).toHaveBeenCalledWith('item-2')
  })
})
