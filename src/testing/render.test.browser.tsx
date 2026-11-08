import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { describe, expect, it } from 'vitest'

import { useCopy } from '@/feature/copy/useCopy'
import { useRoute } from '@/feature/route/useRoute'

import { renderWithProviders } from './render.browser'

const Probe = () => {
  const { t } = useCopy()
  const route = useRoute()
  const params = useParams()
  const greeting = useQuery({ queryKey: ['greeting'], queryFn: () => Promise.resolve('cached') })

  return (
    <div>
      <p>{t('common.appName')}</p>
      <p>{route.pathname}</p>
      <p>{`item ${params.itemId ?? 'none'}`}</p>
      <p>{greeting.data ?? 'pending'}</p>
    </div>
  )
}

describe('renderWithProviders (browser)', () => {
  it('wraps the ui in copy, a memory router and a query client', async () => {
    const screen = await renderWithProviders(<Probe />, { route: '/items/7', path: '/items/:itemId' })

    await expect.element(screen.getByText('Rosk')).toBeVisible()
    await expect.element(screen.getByText('/items/7')).toBeVisible()
    await expect.element(screen.getByText('item 7')).toBeVisible()
    await expect.element(screen.getByText('cached')).toBeVisible()
    expect(screen.queryClient.getQueryData(['greeting'])).toBe('cached')
    expect(screen.router.state.location.pathname).toBe('/items/7')
  })

  it('rejects a real network call loudly', async () => {
    await expect(fetch('/anything')).rejects.toThrow('fetch is stubbed in browser tests')
  })

  it('starts each test with empty storage and no theme pinned', () => {
    expect(window.localStorage.length).toBe(0)
    window.localStorage.setItem('leak', 'x')
    document.documentElement.dataset.theme = 'dark'
  })

  it('cleared what the previous test left behind', () => {
    expect(window.localStorage.getItem('leak')).toBeNull()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
})
