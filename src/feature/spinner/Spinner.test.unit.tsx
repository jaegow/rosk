import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/testing/render.unit'

import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('announces a polite loading status, in the caller\'s words when given', () => {
    const view = renderWithProviders(
      <>
        <Spinner />
        <Spinner label="Saving notes" />
      </>,
    )

    expect(view.getByRole('status', { name: 'Loading…' })).toBeInTheDocument()
    expect(view.getByRole('status', { name: 'Saving notes' })).toBeInTheDocument()
  })
})
