import { describe, expect, it } from 'vitest'

import { remToPixel } from './remToPixel'

describe('remToPixel', () => {
  it('scales rem by the root font size it is given', () => {
    expect(remToPixel(0.5, 16)).toBe(8)
    expect(remToPixel(0.25, 20)).toBe(5)
    expect(remToPixel(0, 16)).toBe(0)
  })
})
