import { describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { renderWithProviders } from '@/testing/render.browser'

import { Popover } from './Popover'

describe('Popover', () => {
  it('opens from its trigger as a dialog, closes on Escape back to the trigger, and closes from its Close CTA', async () => {
    const screen = await renderWithProviders(
      <Popover>
        <Popover.Trigger>Details</Popover.Trigger>
        <Popover.Content aria-label="Item Details">
          <p>Created yesterday</p>
          <Popover.Close />
        </Popover.Content>
      </Popover>,
    )
    const trigger = screen.getByRole('button', { name: 'Details' })

    await userEvent.click(trigger)
    const dialog = page.getByRole('dialog', { name: 'Item Details' })
    await expect.element(dialog).toBeVisible()
    await expect.element(dialog.getByText('Created yesterday')).toBeVisible()

    await userEvent.keyboard('{Escape}')
    await expect.poll(() => page.getByRole('dialog').query()).toBeNull()
    await expect.element(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await userEvent.click(page.getByRole('dialog').getByRole('button', { name: 'Close' }))
    await expect.poll(() => page.getByRole('dialog').query()).toBeNull()
  })
})
