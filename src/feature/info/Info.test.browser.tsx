import { describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { renderWithProviders } from '@/testing/render.browser'

import { Info } from './Info'

describe('Info', () => {
  it('opens its help on hover, closes it on Escape, and opens it again on press', async () => {
    const screen = await renderWithProviders(<Info label="About Retention">Notes are kept for 30 days.</Info>)
    const info = screen.getByRole('button', { name: 'About Retention' })
    const help = page.getByRole('tooltip', { name: 'Notes are kept for 30 days.' })

    await userEvent.hover(info)
    await expect.element(help).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    await expect.poll(() => page.getByRole('tooltip').query()).toBeNull()

    await userEvent.click(info)
    await expect.element(help).toBeInTheDocument()
  })
})
