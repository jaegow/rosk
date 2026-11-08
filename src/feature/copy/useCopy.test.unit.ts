import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCopy } from './useCopy'

describe('useCopy', () => {
  it('resolves a flat dotted key to its English copy', () => {
    const view = renderHook(() => useCopy())
    expect(view.result.current.t('common.appName')).toBe('Rosk')
    expect(view.result.current.t('common.actions.retry')).toBe('Try Again')
  })
})
