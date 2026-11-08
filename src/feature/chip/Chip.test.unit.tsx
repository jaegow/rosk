import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/testing/render.unit'

import { Chip } from './Chip'

describe('Chip', () => {
  it('shows its label and count and takes no press of its own', () => {
    const view = renderWithProviders(
      <Chip
        label="Draft"
        status="warning"
        count={4}
      />,
    )

    expect(view.getByText('Draft')).toBeInTheDocument()
    expect(view.getByText('4')).toBeInTheDocument()
    expect(view.queryByRole('button')).toBeNull()
  })

  it('offers a Remove CTA named for its label that calls onRemove', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    const view = renderWithProviders(
      <Chip
        label="Urgent"
        onRemove={onRemove}
      />,
    )

    await user.click(view.getByRole('button', { name: 'Remove Urgent' }))
    expect(onRemove).toHaveBeenCalledWith()
  })
})
