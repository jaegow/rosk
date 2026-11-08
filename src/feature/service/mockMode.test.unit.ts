import { describe, expect, it } from 'vitest'

import { isMockMode } from './mockMode'

describe('isMockMode', () => {
  it('serves the in-memory services only in development with no API URL', () => {
    expect(isMockMode({ MODE: 'development' })).toBe(true)
    expect(isMockMode({ MODE: 'development', VITE_API_URL: '' })).toBe(true)
    expect(isMockMode({ MODE: 'development', VITE_API_URL: 'https://api.example.test' })).toBe(false)
    expect(isMockMode({ MODE: 'production' })).toBe(false)
    expect(isMockMode({ MODE: 'test' })).toBe(false)
  })
})
