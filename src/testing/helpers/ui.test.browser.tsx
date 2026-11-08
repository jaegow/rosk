import { Dialog } from 'radix-ui'
import { describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'

import { CTA } from '@/feature/cta/CTA'
import { CTA_SLOT } from '@/feature/cta/ctaSlot'
import { Toaster } from '@/feature/toast/Toaster'
import { useToast } from '@/feature/toast/useToast'
import { renderWithProviders } from '@/testing/render.browser'

import { ui_cta, ui_dialog, ui_field, ui_toast } from './ui.browser'

const Raiser = () => {
  const toaster = useToast()
  return (
    <CTA onClick={() => toaster.show({ severity: 'success', title: 'Note saved', cta: { label: 'Undo', onPress: () => undefined } })}>
      Save
    </CTA>
  )
}

describe('ui harness (browser)', () => {
  it('reads a CTA and presses it whether available or unavailable', async () => {
    const onSave = vi.fn()
    const onPublish = vi.fn()
    await renderWithProviders(
      <div>
        <CTA
          variant="primary"
          onClick={() => onSave()}
        >
          Save
        </CTA>
        <CTA
          unavailable
          onClick={() => onPublish()}
        >
          Publish
        </CTA>
      </div>,
    )

    const save = ui_cta('Save')
    const publish = ui_cta('Publish')
    expect(await save.variant()).toBe('primary')
    expect(await save.isUnavailable()).toBe(false)
    expect(await publish.isUnavailable()).toBe(true)

    await save.press()
    await publish.press()

    expect(onSave).toHaveBeenCalledWith()
    expect(onPublish).toHaveBeenCalledWith()
  })

  it('fills a field and reads its value, validity and description', async () => {
    await renderWithProviders(
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          aria-invalid="true"
          aria-describedby="title-error"
        />
        <p id="title-error">Enter a title.</p>
      </div>,
    )

    const title = ui_field('Title')
    await title.fill('First note')

    expect(await title.value()).toBe('First note')
    expect(await title.isInvalid()).toBe(true)
    expect(await title.description()).toBe('Enter a title.')
  })

  it('reads a dialog from the document and leaves it with Escape', async () => {
    const onKeep = vi.fn()
    await renderWithProviders(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Content aria-describedby={undefined}>
            <Dialog.Title>Discard changes</Dialog.Title>
            <CTA onClick={() => onKeep()}>Keep editing</CTA>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    )

    const dialog = ui_dialog('Discard changes')
    await dialog.cta('Keep editing').press()
    expect(onKeep).toHaveBeenCalledWith()

    await dialog.escape()
    await expect.poll(() => dialog.locator.query()).toBeNull()
  })

  it('counts raised toasts and presses a shown toast CTA', async () => {
    await renderWithProviders(
      <div>
        <Raiser />
        <Toaster />
      </div>,
    )
    const toasts = ui_toast()
    const before = toasts.raisedCount({ title: 'Note saved' })

    await ui_cta('Save').press()

    await expect.poll(() => toasts.raisedCount({ title: 'Note saved' })).toBe(before + 1)
    expect(toasts.raised()).toEqual([expect.objectContaining({ severity: 'success', title: 'Note saved', scope: 'component' })])
    await expect.element(toasts.shown('Note saved')).toBeVisible()

    await toasts.cta('Note saved', 'Undo').press()
    await expect.poll(() => toasts.shown('Note saved').query()).toBeNull()
  })

  it('locates a box by its slot constant', async () => {
    await renderWithProviders(<CTA icon={{ start: 'close' }}>Close</CTA>)

    await expect.element(page.getBySlot(CTA_SLOT.label)).toHaveTextContent('Close')
  })
})
