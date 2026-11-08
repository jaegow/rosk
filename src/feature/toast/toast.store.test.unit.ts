import { describe, expect, it, vi } from 'vitest'

import { getToastRaised, getToastSnapshot, resetToast, subscribeToast, toast, TOAST_DURATION_MS, TOAST_SHOWN_LIMIT } from './toast.store'

const titles = (entries: { title: string }[]) => entries.map((entry) => entry.title)

describe('toast store', () => {
  it('shows toasts up to the limit and queues the rest in order', () => {
    Array.from({ length: TOAST_SHOWN_LIMIT + 1 }, (_, index) => toast.show({ severity: 'info', title: `Note ${index + 1}` }))

    expect(titles(getToastSnapshot().shown)).toEqual(['Note 1', 'Note 2', 'Note 3'])
    expect(titles(getToastSnapshot().queued)).toEqual(['Note 4'])
  })

  it('promotes the first queued toast when a shown one is dismissed', () => {
    const first = toast.show({ severity: 'info', title: 'Note 1' })
    Array.from({ length: TOAST_SHOWN_LIMIT }, (_, index) => toast.show({ severity: 'info', title: `Note ${index + 2}` }))

    toast.dismiss(first)

    expect(titles(getToastSnapshot().shown)).toEqual(['Note 2', 'Note 3', 'Note 4'])
    expect(getToastSnapshot().queued).toEqual([])
  })

  it('folds a repeat of the same message into the toast already showing, restarting it', () => {
    const first = toast.show({ severity: 'warning', title: 'Offline', description: 'Changes will sync later.' })
    const repeat = toast.show({ severity: 'warning', title: 'Offline', description: 'Changes will sync later.' })

    expect(repeat).toBe(first)
    expect(getToastSnapshot().shown).toEqual([expect.objectContaining({ id: first, revision: 2 })])
  })

  it('replaces a toast in place when shown again under the same id', () => {
    toast.show({ id: 'export', severity: 'info', title: 'Exporting' })
    toast.show({ severity: 'info', title: 'Other' })
    toast.show({ id: 'export', severity: 'success', title: 'Export ready' })

    expect(titles(getToastSnapshot().shown)).toEqual(['Export ready', 'Other'])
  })

  it('keeps a danger or required toast until it is acted on and times every other toast out', () => {
    toast.show({ severity: 'danger', title: 'Save failed' })
    toast.show({ scope: 'required', severity: 'warning', title: 'Session ending', cta: { label: 'Stay signed in', onPress: () => undefined } })
    toast.show({ severity: 'success', title: 'Saved' })

    expect(getToastSnapshot().shown.map((entry) => entry.duration)).toEqual([null, null, TOAST_DURATION_MS])
  })

  it('logs every raise, repeats included, until reset', () => {
    toast.show({ severity: 'info', title: 'Offline' })
    toast.show({ severity: 'info', title: 'Offline' })
    toast.show({ scope: 'required', severity: 'warning', title: 'Session ending', cta: { label: 'Stay signed in', onPress: () => undefined } })

    expect(getToastRaised()).toEqual([
      { id: 'toast-1', severity: 'info', title: 'Offline', description: undefined, scope: 'app' },
      { id: 'toast-1', severity: 'info', title: 'Offline', description: undefined, scope: 'app' },
      { id: 'toast-3', severity: 'warning', title: 'Session ending', description: undefined, scope: 'required' },
    ])
    resetToast()
    expect(getToastRaised()).toEqual([])
  })

  it('tells subscribers about each change and clears everything on reset', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToast(listener)

    toast.show({ severity: 'info', title: 'Hello' })
    resetToast()
    unsubscribe()
    toast.show({ severity: 'info', title: 'Unheard' })

    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenCalledWith()
    resetToast()
    expect(getToastSnapshot()).toEqual({ shown: [], queued: [] })
  })
})
