import { describe, expect, it, vi } from 'vitest'

import { combineReads, ownsChrome, pageGateState } from './page.util'

describe('pageGateState', () => {
  it('lets a denial win over every read state', () => {
    expect(pageGateState({ access: 'denied', read: { status: 'error' } })).toBe('denied')
  })

  it('waits on access before reporting a read', () => {
    expect(pageGateState({ access: 'resolving', read: { status: 'error' } })).toBe('resolving')
  })

  it('reports a failed read, then a pending one', () => {
    expect(pageGateState({ read: { status: 'error' } })).toBe('failed')
    expect(pageGateState({ read: { status: 'pending' } })).toBe('loading')
  })

  it('reports empty only once the read has answered', () => {
    expect(pageGateState({ read: { status: 'pending' }, empty: true })).toBe('loading')
    expect(pageGateState({ read: { status: 'success' }, empty: true })).toBe('empty')
  })

  it('is ready with no gate input at all', () => {
    expect(pageGateState({})).toBe('ready')
  })
})

describe('combineReads', () => {
  it('passes the worst of several reads, failure before pending before success', () => {
    expect(combineReads([{ status: 'success' }, { status: 'pending' }])).toEqual({ status: 'pending' })
    expect(combineReads([{ status: 'success' }, { status: 'success' }])).toEqual({ status: 'success' })
    expect(combineReads([{ status: 'pending' }, { status: 'error', error: 'first' }])?.error).toBe('first')
    expect(combineReads([])).toBeUndefined()
  })

  it('retries only the reads that failed', () => {
    const failed = vi.fn()
    const passed = vi.fn()
    combineReads([{ status: 'error', refetch: failed }, { status: 'success', refetch: passed }])?.refetch?.()
    expect(failed).toHaveBeenCalledWith()
    expect(passed).not.toHaveBeenCalled()
  })
})

describe('ownsChrome', () => {
  it('hides the page head and foot only while access resolves or is denied', () => {
    expect((['resolving', 'denied', 'failed', 'loading', 'empty', 'ready'] as const).map(ownsChrome)).toEqual([false, false, true, true, true, true])
  })
})
