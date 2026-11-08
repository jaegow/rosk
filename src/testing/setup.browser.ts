import '@/feature/i18n/i18n.config'
import '@/style/theme.css'
import './helpers/slotLocator.browser'

import { afterEach, beforeEach, vi } from 'vitest'

import { resetToast } from '@/feature/toast/toast.store'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => Promise.reject(new Error(
    `fetch is stubbed in browser tests: ${init?.method ?? 'GET'} ${String(input)} attempted a real network call. Stub fetch or the service before this code path.`,
  ))))
  window.localStorage.clear()
  window.sessionStorage.clear()
  delete document.documentElement.dataset.theme
})

afterEach(resetToast)
