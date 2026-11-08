import { describe, expect, it, vi } from 'vitest'

import { firstRead } from './query.util'

describe('firstRead', () => {
  it('reports a pending or failed first read as the query states it', () => {
    const refetch = vi.fn()
    const error = new Error('offline')
    expect(firstRead({ status: 'pending', data: undefined, error: null, refetch })).toEqual({ status: 'pending', error: null, refetch })
    expect(firstRead({ status: 'error', data: undefined, error, refetch })).toEqual({ status: 'error', error, refetch })
  })

  it('keeps data on screen when a later refetch fails', () => {
    const refetch = vi.fn()
    expect(firstRead({ status: 'error', data: [], error: new Error('offline'), refetch })).toEqual({ status: 'success', refetch })
  })
})
