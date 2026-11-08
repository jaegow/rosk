import { describe, expect, it } from 'vitest'

import { createQueryClient, createTestQueryClient, MAX_QUERY_RETRIES } from './App.queryClient'

describe('createQueryClient', () => {
  it('retries a failed query a bounded number of times', () => {
    const retry = createQueryClient().getDefaultOptions().queries?.retry
    if (typeof retry !== 'function') throw new Error('retry should be a function')
    const error = new Error('offline')
    expect(retry(0, error)).toBe(true)
    expect(retry(MAX_QUERY_RETRIES - 1, error)).toBe(true)
    expect(retry(MAX_QUERY_RETRIES, error)).toBe(false)
  })

  it('never retries a mutation', () => {
    expect(createQueryClient().getDefaultOptions().mutations?.retry).toBe(false)
  })

  it('keeps data fresh briefly so a remount does not refetch', () => {
    expect(createQueryClient().getDefaultOptions().queries?.staleTime).toBe(30_000)
  })
})

describe('createTestQueryClient', () => {
  it('fails fast and never collects a cache entry mid-test', () => {
    const options = createTestQueryClient().getDefaultOptions()
    expect(options.queries?.retry).toBe(false)
    expect(options.queries?.gcTime).toBe(Infinity)
    expect(options.mutations?.retry).toBe(false)
  })

  it('hands out an isolated cache per call', async () => {
    const first = createTestQueryClient()
    const second = createTestQueryClient()
    await first.fetchQuery({ queryKey: ['example'], queryFn: () => 'value' })
    expect(first.getQueryData(['example'])).toBe('value')
    expect(second.getQueryData(['example'])).toBeUndefined()
  })
})
