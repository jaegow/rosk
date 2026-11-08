import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/testing/render.unit'

import { Alert } from './Alert'

describe('Alert', () => {
  it('names its severity beside its title and message, and runs its CTA', async () => {
    const user = userEvent.setup()
    const onReview = vi.fn()
    const view = renderWithProviders(
      <Alert
        severity="warning"
        title="Storage almost full"
        message="Archive old notes to free space."
      >
        <Alert.CTA onClick={() => onReview()}>Review Notes</Alert.CTA>
      </Alert>,
    )

    expect(view.getByRole('img', { name: 'Warning' })).toBeInTheDocument()
    expect(view.getByText('Storage almost full')).toBeInTheDocument()
    expect(view.getByText('Archive old notes to free space.')).toBeInTheDocument()

    await user.click(view.getByRole('button', { name: 'Review Notes' }))
    expect(onReview).toHaveBeenCalledWith()
  })
})
