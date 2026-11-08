import { act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/testing/render.unit'

import { useRoute } from './useRoute'

const RouteProbe = () => {
  const route = useRoute()
  return (
    <div>
      <output data-testid="pathname">{route.pathname}</output>
      <output data-testid="gallery-active">{String(route.isActive('gallery'))}</output>
      <button
        type="button"
        onClick={() => route.navigate('gallery')}
      >
        gallery
      </button>
      <button
        type="button"
        onClick={() => route.replace('home')}
      >
        home
      </button>
    </div>
  )
}

describe('useRoute', () => {
  it('navigates by route name and reports the active route', () => {
    const view = renderWithProviders(<RouteProbe />, { route: '/' })

    expect(view.getByTestId('pathname').textContent).toBe('/')
    expect(view.getByTestId('gallery-active')).toHaveTextContent('false')

    act(() => view.getByRole('button', { name: 'gallery' }).click())
    expect(view.getByTestId('pathname')).toHaveTextContent('/gallery')
    expect(view.getByTestId('gallery-active')).toHaveTextContent('true')

    act(() => view.getByRole('button', { name: 'home' }).click())
    expect(view.getByTestId('pathname').textContent).toBe('/')
  })
})
