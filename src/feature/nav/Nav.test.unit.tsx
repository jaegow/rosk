import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/testing/render.unit'

import { Nav } from './Nav'

const MainNav = () => (
  <Nav label="Main">
    <Nav.Item
      route="home"
      icon="home"
    />
    <Nav.Group label="Reference">
      <Nav.Item route="gallery" />
    </Nav.Group>
  </Nav>
)

describe('Nav', () => {
  it('marks the row for the current route and moves the mark as the reader navigates', async () => {
    const user = userEvent.setup()
    const view = renderWithProviders(<MainNav />, { route: '/' })
    const nav = view.getByRole('navigation', { name: 'Main' })

    expect(view.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(view.getByRole('link', { name: 'Component Gallery' })).not.toHaveAttribute('aria-current')
    expect(nav).toContainElement(view.getByRole('list', { name: 'Reference' }))

    await user.click(view.getByRole('link', { name: 'Component Gallery' }))

    expect(await view.findByRole('link', { name: 'Component Gallery', current: 'page' })).toBeInTheDocument()
    expect(view.router.state.location.pathname).toBe('/gallery')
    expect(view.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })
})
