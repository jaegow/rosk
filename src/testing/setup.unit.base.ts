import '@/feature/i18n/i18n.config'

import { afterEach, beforeEach, vi } from 'vitest'

import { resetToast } from '@/feature/toast/toast.store'

const createMemoryStorage = (): Storage => {
  const entries = new Map<string, string>()
  return {
    get length() {
      return entries.size
    },
    key: (index) => [...entries.keys()][index] ?? null,
    getItem: (key) => entries.get(String(key)) ?? null,
    setItem: (key, value) => void entries.set(String(key), String(value)),
    removeItem: (key) => void entries.delete(String(key)),
    clear: () => entries.clear(),
  }
}

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = createMemoryStorage()
  globalThis.sessionStorage = createMemoryStorage()
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => Promise.reject(new Error(
    `fetch is stubbed in unit tests: ${init?.method ?? 'GET'} ${String(input)} attempted a real network call. Stub fetch or the service before this code path.`,
  ))))
})

afterEach(() => {
  resetToast()
  globalThis.localStorage.clear()
  globalThis.sessionStorage.clear()
})
