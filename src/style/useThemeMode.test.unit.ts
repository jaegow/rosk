import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { applyThemeMode, isThemeMode, THEME_MODE_STORAGE_KEY, useThemeMode } from './useThemeMode'

afterEach(() => {
  window.localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('useThemeMode', () => {
  it('follows the system when nothing is stored', () => {
    const view = renderHook(() => useThemeMode())
    expect(view.result.current.mode).toBe('system')
  })

  it('falls back to the system for a stored value that is not a mode', () => {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, 'sepia')
    const view = renderHook(() => useThemeMode())
    expect(view.result.current.mode).toBe('system')
  })

  it('stores the chosen mode and updates every reader', () => {
    const first = renderHook(() => useThemeMode())
    const second = renderHook(() => useThemeMode())

    act(() => first.result.current.setMode('dark'))

    expect(window.localStorage.getItem(THEME_MODE_STORAGE_KEY)).toBe('dark')
    expect(first.result.current.mode).toBe('dark')
    expect(second.result.current.mode).toBe('dark')
  })

  it('picks up a mode another tab stored', () => {
    const view = renderHook(() => useThemeMode())

    act(() => {
      window.localStorage.setItem(THEME_MODE_STORAGE_KEY, 'light')
      window.dispatchEvent(new StorageEvent('storage', { key: THEME_MODE_STORAGE_KEY }))
    })

    expect(view.result.current.mode).toBe('light')
  })
})

describe('applyThemeMode', () => {
  it('writes an explicit mode to the root and clears it for system', () => {
    applyThemeMode('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')

    applyThemeMode('light')
    expect(document.documentElement.dataset.theme).toBe('light')

    applyThemeMode('system')
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
})

describe('isThemeMode', () => {
  it('accepts only the three modes', () => {
    expect(['light', 'dark', 'system', 'sepia', null, 1].map(isThemeMode)).toEqual([true, true, true, false, false, false])
  })
})
