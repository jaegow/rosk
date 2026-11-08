import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { CTA } from '@/feature/cta/CTA'
import { ui_dialog } from '@/testing/helpers/ui.browser'
import { renderWithProviders } from '@/testing/render.browser'

import { Modal } from './Modal'
import { useModal } from './useModal'

const RenameDialog = ({ onRename }: { onRename: () => void }) => {
  const modal = useModal()

  return (
    <>
      <CTA onClick={() => modal.open()}>Rename Item</CTA>
      <Modal control={modal}>
        <Modal.Head>
          <Modal.Head.Title>Rename Item</Modal.Head.Title>
          <Modal.Head.Subtitle>The new name shows everywhere the item appears.</Modal.Head.Subtitle>
          <Modal.Head.CTAs>
            <Modal.Close />
          </Modal.Head.CTAs>
        </Modal.Head>
        <Modal.Content>Pick a short name.</Modal.Content>
        <Modal.Foot>
          <Modal.Foot.CTA
            lane="secondary"
            onClick={() => modal.close()}
          >
            Cancel
          </Modal.Foot.CTA>
          <Modal.Foot.CTA
            lane="primary"
            onClick={() => {
              onRename()
              modal.close()
            }}
          >
            Rename
          </Modal.Foot.CTA>
        </Modal.Foot>
      </Modal>
    </>
  )
}

describe('Modal', () => {
  it('opens named and described by its head, traps focus, and returns focus to its opener on close', async () => {
    const onRename = vi.fn()
    const screen = await renderWithProviders(<RenameDialog onRename={onRename} />)
    const opener = screen.getByRole('button', { name: 'Rename Item' })

    await userEvent.click(opener)
    const dialog = ui_dialog('Rename Item')
    await expect.element(dialog.locator).toBeVisible()
    await expect.element(dialog.locator).toHaveAccessibleDescription('The new name shows everywhere the item appears.')
    await expect.poll(() => dialog.locator.element().contains(document.activeElement)).toBe(true)

    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await expect.poll(() => dialog.locator.element().contains(document.activeElement)).toBe(true)

    await dialog.cta('Rename').press()
    await expect.poll(() => page.getByRole('dialog').query()).toBeNull()
    expect(onRename).toHaveBeenCalledWith()
    await expect.element(opener).toHaveFocus()
  })

  it('closes on Escape and from its close CTA, each time handing focus back', async () => {
    const screen = await renderWithProviders(<RenameDialog onRename={() => undefined} />)
    const opener = screen.getByRole('button', { name: 'Rename Item' })

    await userEvent.click(opener)
    await ui_dialog('Rename Item').escape()
    await expect.poll(() => page.getByRole('dialog').query()).toBeNull()
    await expect.element(opener).toHaveFocus()

    await userEvent.click(opener)
    await ui_dialog('Rename Item').cta('Close').press()
    await expect.poll(() => page.getByRole('dialog').query()).toBeNull()
    await expect.element(opener).toHaveFocus()
  })

  it('opens from its own trigger CTA without a control', async () => {
    await renderWithProviders(
      <Modal size="sm">
        <Modal.Trigger>Show Details</Modal.Trigger>
        <Modal.Head>
          <Modal.Head.Title>Item Details</Modal.Head.Title>
        </Modal.Head>
        <Modal.Content>Details of the item.</Modal.Content>
      </Modal>,
    )

    await userEvent.click(page.getByRole('button', { name: 'Show Details' }))
    await expect.element(page.getByRole('dialog', { name: 'Item Details' }).getByText('Details of the item.')).toBeVisible()
  })
})
