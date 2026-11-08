import { type QueryClient, skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { itemService } from './item.service'
import type { Item, ItemService } from './item.type'

type ItemArgs<K extends keyof ItemService> = Parameters<ItemService[K]>[0]

type ItemMutationCallbacks<TData> = {
  onSuccess?: (data: TData) => void
  onError?: (error: unknown) => void
}

const itemKey = {
  'GET.Items': () => ['GET.Items'] as const,
  'GET.Item': (id: ItemArgs<'GET.Item'>) => ['GET.Item', id] as const,
}

const settleItemWrite = (queryClient: QueryClient, item: Item) => {
  queryClient.setQueryData(itemKey['GET.Item'](item.id), item)
  void queryClient.invalidateQueries({ queryKey: itemKey['GET.Items']() })
}

const useGetItems = () => useQuery({
  queryKey: itemKey['GET.Items'](),
  queryFn: () => itemService['GET.Items'](),
})

const useGetItem = (id: ItemArgs<'GET.Item'> | undefined) => useQuery({
  queryKey: itemKey['GET.Item'](id ?? ''),
  queryFn: id === undefined ? skipToken : () => itemService['GET.Item'](id),
})

const usePostItem = (callbacks: ItemMutationCallbacks<Item> = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ItemArgs<'POST.Item'>) => itemService['POST.Item'](input),
    onSuccess: (item) => {
      settleItemWrite(queryClient, item)
      callbacks.onSuccess?.(item)
    },
    onError: (error) => callbacks.onError?.(error),
  })
}

const usePutItem = (callbacks: ItemMutationCallbacks<Item> = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (args: ItemArgs<'PUT.Item'>) => itemService['PUT.Item'](args),
    onSuccess: (item) => {
      settleItemWrite(queryClient, item)
      callbacks.onSuccess?.(item)
    },
    onError: (error) => callbacks.onError?.(error),
  })
}

const useDeleteItem = (callbacks: ItemMutationCallbacks<string> = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: ItemArgs<'DELETE.Item'>) => itemService['DELETE.Item'](id),
    onSuccess: (_response, id) => {
      queryClient.removeQueries({ queryKey: itemKey['GET.Item'](id), exact: true })
      void queryClient.invalidateQueries({ queryKey: itemKey['GET.Items']() })
      callbacks.onSuccess?.(id)
    },
    onError: (error) => callbacks.onError?.(error),
  })
}

const useSeedItem = () => {
  const queryClient = useQueryClient()
  return (item: Item) => {
    if (queryClient.getQueryData(itemKey['GET.Item'](item.id)) !== undefined) return
    queryClient.setQueryData(itemKey['GET.Item'](item.id), item, { updatedAt: 0 })
  }
}

const useItem = {
  query: { useGetItems, useGetItem },
  mutate: { usePostItem, usePutItem, useDeleteItem },
  sync: { useSeedItem },
}

export { useItem }
export type { ItemMutationCallbacks }
