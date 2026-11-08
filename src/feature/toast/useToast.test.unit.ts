import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getToastSnapshot } from './toast.store'
import { useToast } from './useToast'

const shownTitles = () => getToastSnapshot().shown.map((entry) => entry.title)

describe('useToast', () => {
  it('dismisses its component toasts when the view unmounts and leaves app and required toasts', () => {
    const view = renderHook(() => useToast())

    view.result.current.show({ severity: 'danger', title: 'Could not save' })
    view.result.current.show({ scope: 'app', severity: 'info', title: 'Export running' })
    view.result.current.show({ scope: 'required', severity: 'warning', title: 'Session ending', cta: { label: 'Stay signed in', onPress: () => undefined } })
    view.unmount()

    expect(shownTitles()).toEqual(['Export running', 'Session ending'])
  })

  it('stops owning a toast once it is dismissed or re-raised under app scope', () => {
    const view = renderHook(() => useToast())

    const dismissed = view.result.current.show({ severity: 'info', title: 'Draft kept' })
    view.result.current.dismiss(dismissed)
    view.result.current.show({ id: 'sync', severity: 'info', title: 'Syncing' })
    view.result.current.show({ id: 'sync', scope: 'app', severity: 'success', title: 'Synced' })
    view.unmount()

    expect(shownTitles()).toEqual(['Synced'])
  })
})
