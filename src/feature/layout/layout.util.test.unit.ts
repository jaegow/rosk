import { describe, expect, it } from 'vitest'

import { footCTASize, footCTAVariant, nextHeadingLevel } from './layout.util'

describe('nextHeadingLevel', () => {
  it('steps a nested heading down one level and stops at h6', () => {
    expect([1, 2, 3, 4, 5, 6].map((level) => nextHeadingLevel(level as 1 | 2 | 3 | 4 | 5 | 6))).toEqual([2, 3, 4, 5, 6, 6])
  })
})

describe('footCTAVariant', () => {
  it('paints each lane its own variant, keeping primary for page and modal feet', () => {
    expect(footCTAVariant('page', 'primary')).toBe('primary')
    expect(footCTAVariant('modal', 'primary')).toBe('primary')
    expect(footCTAVariant('card', 'primary')).toBe('secondary')
    expect(footCTAVariant('card', 'secondary')).toBe('secondary')
    expect(footCTAVariant('page', 'tertiary')).toBe('tertiary')
  })
})

describe('footCTASize', () => {
  it('sizes a card foot small and a page or modal foot medium', () => {
    expect(footCTASize('card')).toBe('sm')
    expect(footCTASize('modal')).toBe('md')
    expect(footCTASize('page')).toBe('md')
  })
})
