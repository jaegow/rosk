import { describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { renderWithProviders } from '@/testing/render.browser'

import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('shows its content while its trigger holds keyboard focus and hides it on Escape', async () => {
    const screen = await renderWithProviders(
      <Tooltip>
        <Tooltip.Trigger>Shortcuts</Tooltip.Trigger>
        <Tooltip.Content>Press ? to list every shortcut</Tooltip.Content>
      </Tooltip>,
    )

    await userEvent.tab()
    await expect.element(screen.getByRole('button', { name: 'Shortcuts' })).toHaveFocus()
    await expect.element(page.getByRole('tooltip', { name: 'Press ? to list every shortcut' })).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    await expect.poll(() => page.getByRole('tooltip').query()).toBeNull()
  })
})
