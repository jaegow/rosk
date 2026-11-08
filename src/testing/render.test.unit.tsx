import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { describe, expect, it } from 'vitest'

import { useCopy } from '@/feature/copy/useCopy'

import { renderWithProviders } from './render.unit'

const Probe = () => {
  const { t } = useCopy()
  const params = useParams()
  const greeting = useQuery({ queryKey: ['greeting'], queryFn: () => Promise.resolve('cached') })

  return (
    <div>
      <p>{t('common.appName')}</p>
      <p>{`item ${params.itemId ?? 'none'}`}</p>
      <p>{greeting.data ?? 'pending'}</p>
    </div>
  )
}

describe('renderWithProviders (unit)', () => {
  it('wraps the ui in copy, a memory router and a query client', async () => {
    const view = renderWithProviders(<Probe />, { route: '/items/7', path: '/items/:itemId' })

    expect(view.getByText('Rosk')).toBeInTheDocument()
    expect(view.getByText('item 7')).toBeInTheDocument()
    expect(await view.findByText('cached')).toBeInTheDocument()
    expect(view.queryClient.getQueryData(['greeting'])).toBe('cached')
    expect(view.router.state.location.pathname).toBe('/items/7')
  })

  it('rejects a real network call loudly', async () => {
    await expect(fetch('/anything')).rejects.toThrow('fetch is stubbed in unit tests')
  })

  it('provides polyfills jsdom lacks', () => {
    expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(false)
    expect(() => new ResizeObserver(() => undefined).observe(document.body)).not.toThrow()
    expect(document.body.getAnimations()).toEqual([])
    expect(() => document.body.scrollTo(0, 0)).not.toThrow()
  })
})
