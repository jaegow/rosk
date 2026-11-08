import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { renderWithProviders } from '@/testing/render.browser'

import { DropdownMenu } from './DropdownMenu'

const ViewMenu = ({ onRename }: { onRename: () => void }) => {
  const [archived, setArchived] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>Options</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Item</DropdownMenu.Label>
        <DropdownMenu.Item
          icon="edit"
          onSelect={() => onRename()}
        >
          Rename
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.CheckboxItem
          checked={archived}
          onCheckedChange={setArchived}
        >
          Show Archived
        </DropdownMenu.CheckboxItem>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

describe('DropdownMenu', () => {
  it('opens from the keyboard, runs the chosen item and closes back to its trigger', async () => {
    const onRename = vi.fn()
    const screen = await renderWithProviders(<ViewMenu onRename={onRename} />)
    const trigger = screen.getByRole('button', { name: 'Options' })

    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    await expect.element(page.getByRole('menuitem', { name: 'Rename' })).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    expect(onRename).toHaveBeenCalledWith()
    await expect.poll(() => page.getByRole('menu').query()).toBeNull()
    await expect.element(trigger).toHaveFocus()
  })

  it('toggles a checkbox item and reports its checked state', async () => {
    const screen = await renderWithProviders(<ViewMenu onRename={() => undefined} />)

    await userEvent.click(screen.getByRole('button', { name: 'Options' }))
    await userEvent.click(page.getByRole('menuitemcheckbox', { name: 'Show Archived' }))
    await userEvent.click(screen.getByRole('button', { name: 'Options' }))

    await expect.element(page.getByRole('menuitemcheckbox', { name: 'Show Archived' })).toHaveAttribute('aria-checked', 'true')
  })

  it('keeps an unavailable item reachable so its press can explain itself', async () => {
    const onExplain = vi.fn()
    const screen = await renderWithProviders(
      <DropdownMenu>
        <DropdownMenu.Trigger>Options</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            unavailable
            onSelect={() => onExplain()}
          >
            Archive
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    )

    await expect.element(screen.getByRole('button', { name: 'Options' })).toBeVisible()
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    const archive = page.getByRole('menuitem', { name: 'Archive' })
    await expect.element(archive).toHaveFocus()
    await expect.element(archive).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{Enter}')
    expect(onExplain).toHaveBeenCalledWith()
  })
})
