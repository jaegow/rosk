import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ErrorBoundary } from './ErrorBoundary'

const failure = { active: true }

const Unstable = () => {
  if (failure.active) throw new Error('render failed')
  return <p>recovered</p>
}

beforeEach(() => {
  failure.active = true
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('ErrorBoundary', () => {
  it('renders its children when nothing throws', () => {
    failure.active = false
    render(<ErrorBoundary><Unstable /></ErrorBoundary>)
    expect(screen.getByText('recovered')).toBeInTheDocument()
  })

  it('shows the fallback and reports the error when a child throws', () => {
    const onError = vi.fn()
    render(<ErrorBoundary onError={onError}><Unstable /></ErrorBoundary>)

    expect(screen.getByRole('alert')).toHaveTextContent('Something Went Wrong')
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'render failed' }), expect.anything())
  })

  it('renders the children again after a retry', async () => {
    render(<ErrorBoundary><Unstable /></ErrorBoundary>)

    failure.active = false
    await userEvent.click(screen.getByRole('button', { name: 'Try Again' }))

    expect(screen.getByText('recovered')).toBeInTheDocument()
  })
})
