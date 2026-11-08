import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { AppProvider } from '@/feature/app/App.provider'
import { createTestQueryClient } from '@/feature/app/App.queryClient'
import { APP_ROUTES } from '@/feature/app/App.router'

const renderGallery = () => render(
  <AppProvider queryClient={createTestQueryClient()}>
    <RouterProvider router={createMemoryRouter(APP_ROUTES, { initialEntries: ['/gallery'] })} />
  </AppProvider>,
)

describe('gallery', () => {
  it('lists entries by group, opens an entry and shows the tokens', async () => {
    const screen = await renderGallery()
    const main = screen.getByRole('main')
    await expect.element(screen.getByRole('heading', { level: 1, name: 'Component Gallery' })).toBeVisible()

    const primitives = main.getByRole('region', { name: 'Primitives' })
    await expect.element(primitives.getByRole('link', { name: 'Chip', exact: true })).toBeVisible()
    await expect.element(primitives.getByRole('link', { name: 'Tabs', exact: true })).toBeVisible()

    await primitives.getByRole('link', { name: 'Chip', exact: true }).click()
    await expect.element(screen.getByRole('heading', { level: 1, name: 'Chip' })).toBeVisible()
    await expect.element(screen.getByRole('region', { name: 'Statuses' }).getByText('In Review')).toBeVisible()
    await expect.element(screen.getByRole('region', { name: 'Removable' }).getByRole('button', { name: 'Remove Urgent' })).toBeVisible()

    await main.getByRole('link', { name: 'Tokens' }).click()
    await expect.element(screen.getByRole('heading', { level: 1, name: 'Tokens' })).toBeVisible()
    await expect.element(screen.getByRole('region', { name: 'Colors' }).getByRole('figure', { name: /^brand #/ })).toBeVisible()
    await expect.element(screen.getByRole('region', { name: 'Stress Ladder' }).getByRole('figure', { name: /^stress-xs color-mix/ })).toBeVisible()
    await expect.element(screen.getByRole('region', { name: 'Type Scale' }).getByRole('figure', { name: /^h1 font-size/ })).toBeVisible()

    await main.getByRole('link', { name: 'Component Gallery' }).click()
    await expect.element(screen.getByRole('heading', { level: 1, name: 'Component Gallery' })).toBeVisible()
  })
})
