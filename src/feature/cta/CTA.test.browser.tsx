import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { renderWithProviders } from '@/testing/render.browser'

import { CTA } from './CTA'
import { CTABar } from './CTABar'

const SaveOnce = ({ onSave }: { onSave: () => void }) => {
  const [loading, setLoading] = useState(false)

  return (
    <CTA
      variant="primary"
      loading={loading}
      onClick={() => {
        onSave()
        setLoading(true)
      }}
    >
      Save Notes
    </CTA>
  )
}

describe('CTA', () => {
  it('names an icon-only CTA and shows that name as a tooltip on hover and on keyboard focus', async () => {
    const screen = await renderWithProviders(
      <CTA
        iconOnly="copy"
        aria-label="Copy Link"
      />,
    )
    const copy = screen.getByRole('button', { name: 'Copy Link' })

    await userEvent.hover(copy)
    await expect.element(page.getByRole('tooltip', { name: 'Copy Link' })).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    await expect.poll(() => page.getByRole('tooltip').query()).toBeNull()

    await userEvent.tab()
    await expect.element(copy).toHaveFocus()
    await expect.element(page.getByRole('tooltip', { name: 'Copy Link' })).toBeInTheDocument()
  })

  it('keeps its box while loading, reports busy and swallows further presses', async () => {
    const onSave = vi.fn()
    const screen = await renderWithProviders(<SaveOnce onSave={onSave} />)
    const save = screen.getByRole('button', { name: 'Save Notes' })
    const idleWidth = save.element().getBoundingClientRect().width

    await userEvent.click(save)
    await expect.element(save).toHaveAttribute('aria-busy', 'true')
    expect(save.element().getBoundingClientRect().width).toBe(idleWidth)

    await userEvent.click(save)
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith()
  })

  it('still reaches its press from the keyboard while unavailable and announces itself as disabled', async () => {
    const onSubmit = vi.fn()
    const screen = await renderWithProviders(
      <CTA
        unavailable
        onClick={() => onSubmit()}
      >
        Submit
      </CTA>,
    )
    const submit = screen.getByRole('button', { name: 'Submit' })

    await expect.element(submit).toHaveAttribute('aria-disabled', 'true')
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(onSubmit).toHaveBeenCalledWith()
  })

  it('renders a link for an href, and onto the caller\'s element under asChild', async () => {
    const screen = await renderWithProviders(
      <>
        <CTA
          href="/notes"
          icon={{ end: 'external' }}
        >
          Open Notes
        </CTA>
        <CTA asChild>
          <a href="/help">Get Help</a>
        </CTA>
      </>,
    )

    await expect.element(screen.getByRole('link', { name: 'Open Notes' })).toHaveAttribute('href', '/notes')
    await expect.element(screen.getByRole('link', { name: 'Get Help' })).toHaveAttribute('href', '/help')
    expect(screen.getByRole('button').query()).toBeNull()
  })
})

describe('CTABar', () => {
  it('reads its CTAs lane by lane, tertiary at the start edge and the closers at the end edge', async () => {
    const screen = await renderWithProviders(
      <div
        data-testid="bar-host"
        style={{ width: '40rem' }}
      >
        <CTABar>
          <CTABar.CTA
            lane="primary"
            variant="primary"
          >
            Save
          </CTABar.CTA>
          <CTABar.CTA
            lane="tertiary"
            variant="danger"
          >
            Delete
          </CTABar.CTA>
          <CTABar.CTA lane="secondary">Cancel</CTABar.CTA>
        </CTABar>
      </div>,
    )
    const host = screen.getByTestId('bar-host').element().getBoundingClientRect()
    const remove = screen.getByRole('button', { name: 'Delete' }).element().getBoundingClientRect()
    const save = screen.getByRole('button', { name: 'Save' }).element().getBoundingClientRect()

    expect(screen.getByRole('button').elements().map((cta) => cta.textContent)).toEqual(['Delete', 'Cancel', 'Save'])
    expect(remove.left).toBe(host.left)
    expect(save.right).toBe(host.right)
  })
})
