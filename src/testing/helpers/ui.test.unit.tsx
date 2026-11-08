import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CTA } from '@/feature/cta/CTA'
import { toast } from '@/feature/toast/toast.store'

import { ui_cta, ui_field, ui_toast } from './ui.unit'

describe('ui harness (unit)', () => {
  it('reads a CTA and presses an unavailable one from the keyboard', async () => {
    const user = userEvent.setup()
    const onPublish = vi.fn()
    render(
      <CTA
        unavailable
        onClick={() => onPublish()}
      >
        Publish
      </CTA>,
    )

    const publish = ui_cta('Publish', screen)
    expect(await publish.isUnavailable()).toBe(true)
    expect(await publish.isBusy()).toBe(false)
    expect(await publish.variant()).toBe('secondary')

    await publish.press(user)

    expect(onPublish).toHaveBeenCalledWith()
  })

  it('fills a field and reads its description', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          aria-describedby="title-hint"
        />
        <p id="title-hint">Shown on the card.</p>
      </div>,
    )

    const title = ui_field('Title')
    await title.fill(user, 'First note')

    expect(await title.value()).toBe('First note')
    expect(await title.isInvalid()).toBe(false)
    expect(await title.description()).toBe('Shown on the card.')
  })

  it('counts raised toasts by what they say', () => {
    toast.show({ severity: 'danger', title: 'Could not save' })
    toast.show({ severity: 'info', title: 'Syncing' })

    expect(ui_toast().raisedCount({ severity: 'danger' })).toBe(1)
    expect(ui_toast().raised({ title: 'Syncing' })).toEqual([{ id: 'toast-2', severity: 'info', title: 'Syncing', description: undefined, scope: 'app' }])
  })
})
