import { describe, expect, it } from 'vitest'

import { composite, contrastRatio, parseHex, passesAA, relativeLuminance, toHex, WCAG_AA_TEXT } from './contrast'

describe('contrast', () => {
  it('parses six and three digit hex in either case', () => {
    expect(parseHex('#FF8000')).toEqual({ red: 255, green: 128, blue: 0 })
    expect(parseHex('#f80')).toEqual({ red: 255, green: 136, blue: 0 })
    expect(toHex(parseHex('#abcdef'))).toBe('#ABCDEF')
  })

  it('rejects a value that is not a hex colour', () => {
    expect(() => parseHex('#12345')).toThrow('not a hex colour')
    expect(() => parseHex('red')).toThrow('not a hex colour')
  })

  it('measures the luminance extremes', () => {
    expect(relativeLuminance('#000000')).toBe(0)
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 6)
  })

  it('matches the published WCAG ratios', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 6)
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1)
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2)
    expect(contrastRatio('#777777', '#FFFFFF')).toBeLessThan(WCAG_AA_TEXT)
  })

  it('is symmetric in its arguments', () => {
    expect(contrastRatio('#3A44A6', '#FFFFFF')).toBe(contrastRatio('#FFFFFF', '#3A44A6'))
  })

  it('composites an alpha layer over a surface', () => {
    expect(composite('#000000', 0.5, '#FFFFFF')).toBe('#808080')
    expect(composite('#FF0000', 1, '#0000FF')).toBe('#FF0000')
    expect(composite('#FF0000', 0, '#0000FF')).toBe('#0000FF')
  })

  it('passes AA at 4.5:1 and fails below it', () => {
    expect(passesAA('#767676', '#FFFFFF')).toBe(true)
    expect(passesAA('#777777', '#FFFFFF')).toBe(false)
  })
})
