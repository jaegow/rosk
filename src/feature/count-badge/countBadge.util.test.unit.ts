import { describe, expect, it } from 'vitest'

import { COUNT_BADGE_CAP, countBadgeText } from './countBadge.util'

describe('countBadgeText', () => {
  it('shows a count up to the cap as it is', () => {
    expect(countBadgeText(0)).toBe('0')
    expect(countBadgeText(COUNT_BADGE_CAP)).toBe('99')
  })

  it('folds a count past the cap into the cap and a plus', () => {
    expect(countBadgeText(COUNT_BADGE_CAP + 1)).toBe('99+')
  })
})
