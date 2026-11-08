import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from 'vitest-browser-react'

import { AppProvider } from '@/feature/app/App.provider'
import { createTestQueryClient } from '@/feature/app/App.queryClient'
import { APP_ROUTES } from '@/feature/app/App.router'
import { ServiceError } from '@/feature/service/serviceError'
import { createItemsMock, setup_DeleteItem, setup_GetItem, setup_GetItems, setup_PostItem, setup_PutItem } from '@/testing/helpers/setup.items'
import { ui_cta, ui_dialog, ui_toast } from '@/testing/helpers/ui.browser'

const renderApp = () => render(
  <AppProvider queryClient={createTestQueryClient()}>
    <RouterProvider router={createMemoryRouter(APP_ROUTES, { initialEntries: ['/'] })} />
  </AppProvider>,
)

const getViewItems = () => ({
  get nav() {
    return { items: page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Items' }) }
  },
  get copy() {
    return { heading: page.getByRole('heading', { level: 1, name: 'Items' }) }
  },
  get cta() {
    return {
      newItem: ui_cta('New Item'),
      row: (name: string) => page.getByRole('table', { name: 'Items' }).getByRole('link', { name }),
    }
  },
  get dialog() {
    return { create: ui_dialog('New Item'), edit: ui_dialog('Edit Item') }
  },
  get toast() {
    return ui_toast()
  },
})

describe('items', () => {
  it('creates an item, finds it in the list, edits it and deletes it', async () => {
    const mock = createItemsMock()
    setup_GetItems(mock)
    setup_GetItem(mock)
    const post = setup_PostItem(mock)
    const put = setup_PutItem(mock)
    const remove = setup_DeleteItem(mock)
    await renderApp()
    const view = getViewItems()

    await view.nav.items.click()
    await expect.element(view.copy.heading).toBeVisible()
    await expect.element(view.cta.row('First Example')).toBeVisible()

    await view.cta.newItem.press()
    const create = view.dialog.create
    await expect.element(create.field('Name').locator).toHaveValue('')
    expect(await create.field('Name').isInvalid()).toBe(false)
    await create.cta('Save').press()
    await expect.poll(() => create.field('Name').isInvalid()).toBe(true)
    expect(await create.field('Name').description()).toBe('This field is required.')
    expect(post.spy).not.toHaveBeenCalled()

    await create.field('Name').fill('Fresh Example')
    await create.field('Description').fill('Made in the journey.')
    await create.cta('Save').press()
    await expect.element(create.locator).not.toBeInTheDocument()
    expect(post.spy).toHaveBeenCalledWith({ name: 'Fresh Example', status: 'draft', description: 'Made in the journey.' })
    await expect.poll(() => view.toast.raisedCount({ severity: 'success', title: 'Item Created' })).toBe(1)
    await expect.element(view.cta.row('Fresh Example')).toBeVisible()

    await view.cta.row('Fresh Example').click()
    const edit = view.dialog.edit
    await expect.element(edit.field('Name').locator).toHaveValue('Fresh Example')
    await edit.field('Name').fill('Renamed Example')
    await edit.escape()
    await ui_cta('Keep Editing', edit.locator).press()
    await expect.element(edit.field('Name').locator).toHaveValue('Renamed Example')
    put.spy.mockRejectedValueOnce(new ServiceError(422, { fields: { name: 'taken' } }))
    await edit.cta('Save').press()
    await expect.poll(() => edit.field('Name').isInvalid()).toBe(true)
    expect(await edit.field('Name').description()).toBe('This value wasn\'t accepted. Check it and try again.')
    await expect.element(edit.field('Name').locator).toHaveValue('Renamed Example')
    expect(view.toast.raisedCount({ severity: 'danger' })).toBe(0)
    await edit.cta('Save').press()
    await expect.element(edit.locator).not.toBeInTheDocument()
    expect(put.spy).toHaveBeenCalledWith({ id: 'item-5', input: { name: 'Renamed Example', status: 'draft', description: 'Made in the journey.' } })
    await expect.element(view.cta.row('Renamed Example')).toBeVisible()

    await view.cta.row('Renamed Example').click()
    await edit.cta('Delete').press()
    await edit.cta('Delete Item').press()
    await expect.element(edit.locator).not.toBeInTheDocument()
    expect(remove.spy).toHaveBeenCalledWith('item-5')
    await expect.element(view.cta.row('Renamed Example')).not.toBeInTheDocument()
    await expect.poll(() => view.toast.raisedCount({ severity: 'success', title: 'Item Deleted' })).toBe(1)

    expect(view.toast.raisedCount({ severity: 'danger' })).toBe(0)
  })
})
