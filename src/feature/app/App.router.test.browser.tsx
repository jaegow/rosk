import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { AppProvider } from './App.provider'
import { createTestQueryClient } from './App.queryClient'
import { APP_ROUTES } from './App.router'

const renderAt = (path: string) => {
  const router = createMemoryRouter(APP_ROUTES, { initialEntries: [path] })
  return render(
    <AppProvider queryClient={createTestQueryClient()}>
      <RouterProvider router={router} />
    </AppProvider>,
  )
}

describe('app routes', () => {
  it('renders the lazy home page at /', async () => {
    const screen = await renderAt('/')
    await expect.element(screen.getByRole('heading', { level: 1, name: 'Rosk' })).toBeVisible()
  })

  it('renders the gallery page at /gallery', async () => {
    const screen = await renderAt('/gallery')
    await expect.element(screen.getByRole('heading', { level: 1, name: 'Component Gallery' })).toBeVisible()
  })

  it('renders not found for an unknown path and links home', async () => {
    const screen = await renderAt('/nowhere')
    await expect.element(screen.getByRole('heading', { name: 'Page Not Found' })).toBeVisible()

    await screen.getByRole('main').getByRole('link', { name: 'Home' }).click()
    await expect.element(screen.getByRole('heading', { level: 1, name: 'Rosk' })).toBeVisible()
  })

  it('navigates from home to the gallery', async () => {
    const screen = await renderAt('/')
    await screen.getByRole('main').getByRole('link', { name: 'Component Gallery' }).click()
    await expect.element(screen.getByRole('heading', { level: 1, name: 'Component Gallery' })).toBeVisible()
  })

  it('switches the theme from the shell', async () => {
    const screen = await renderAt('/')
    await screen.getByRole('button', { name: 'Theme' }).click()
    await screen.getByRole('menuitemcheckbox', { name: 'Dark' }).click()
    await expect.poll(() => document.documentElement.dataset.theme).toBe('dark')

    await screen.getByRole('button', { name: 'Theme' }).click()
    await screen.getByRole('menuitemcheckbox', { name: 'System' }).click()
    await expect.poll(() => document.documentElement.dataset.theme).toBeUndefined()
  })
})
