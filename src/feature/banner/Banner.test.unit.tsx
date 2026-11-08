import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/testing/render.unit'

import { Banner } from './Banner'

describe('Banner', () => {
  it('shows its message with no icon, runs its CTA, and offers Dismiss only when dismissible', async () => {
    const user = userEvent.setup()
    const onReload = vi.fn()
    const onDismiss = vi.fn()
    const view = renderWithProviders(
      <>
        <Banner
          message="A new version is ready."
          onDismiss={onDismiss}
        >
          <Banner.CTA onClick={() => onReload()}>Reload</Banner.CTA>
        </Banner>
        <Banner
          variant="warning"
          message="You are viewing a shared workspace."
        />
      </>,
    )

    expect(view.getByText('A new version is ready.')).toBeInTheDocument()
    expect(view.queryByRole('img')).toBeNull()
    expect(view.getAllByRole('button', { name: 'Dismiss' })).toHaveLength(1)

    await user.click(view.getByRole('button', { name: 'Reload' }))
    expect(onReload).toHaveBeenCalledWith()
    await user.click(view.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledWith()
  })
})
