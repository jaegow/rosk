import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { renderWithProviders } from '@/testing/render.browser'

import { Collapsible } from './Collapsible'

describe('Collapsible', () => {
  it('opens and closes its content from the trigger by press and keyboard, announcing the state', async () => {
    const screen = await renderWithProviders(
      <Collapsible>
        <Collapsible.Trigger>History</Collapsible.Trigger>
        <Collapsible.Content>Edited twice</Collapsible.Content>
      </Collapsible>,
    )
    const trigger = screen.getByRole('button', { name: 'History' })

    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Edited twice').query()).toBeNull()

    await userEvent.click(trigger)
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect.element(screen.getByText('Edited twice')).toBeVisible()

    await userEvent.keyboard('{Enter}')
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect.poll(() => screen.getByText('Edited twice').query()).toBeNull()
  })
})
