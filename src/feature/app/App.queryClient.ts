import { QueryClient } from '@tanstack/react-query'

const MAX_QUERY_RETRIES = 2

const createQueryClient = (): QueryClient => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount) => failureCount < MAX_QUERY_RETRIES,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
})

const createTestQueryClient = (): QueryClient => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

export { createQueryClient, createTestQueryClient, MAX_QUERY_RETRIES }
