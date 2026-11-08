import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useModal } from './useModal'

describe('useModal', () => {
  it('starts closed, opens and closes through its instance', () => {
    const hook = renderHook(() => useModal())
    expect(hook.result.current.isOpen).toBe(false)

    act(() => hook.result.current.open())
    expect(hook.result.current.isOpen).toBe(true)

    act(() => hook.result.current.close())
    expect(hook.result.current.isOpen).toBe(false)
  })

  it('can start open', () => {
    const hook = renderHook(() => useModal(true))
    expect(hook.result.current.isOpen).toBe(true)
  })
})
