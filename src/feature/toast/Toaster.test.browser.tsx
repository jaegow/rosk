import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { renderWithProviders } from '@/testing/render.browser'

import { toast } from './toast.store'
import { Toaster } from './Toaster'

describe('Toaster', () => {
  it('shows a raised toast with its words, runs its CTA, and leaves on Dismiss', async () => {
    const onUndo = vi.fn()
    await renderWithProviders(<Toaster />)

    toast.show({ severity: 'success', title: 'Note archived', description: 'It moved to the archive.', cta: { label: 'Undo', onPress: onUndo } })
    const region = page.getByRole('region', { name: /Notifications/ })
    await expect.element(region.getByText('Note archived')).toBeVisible()
    await expect.element(region.getByText('It moved to the archive.')).toBeVisible()
    await expect.element(region.getByRole('img', { name: 'Success' })).toBeInTheDocument()

    await userEvent.click(region.getByRole('button', { name: 'Undo' }))
    expect(onUndo).toHaveBeenCalledWith()
    await expect.poll(() => region.getByText('Note archived').query()).toBeNull()

    toast.show({ severity: 'danger', title: 'Could not archive' })
    await expect.element(region.getByText('Could not archive')).toBeVisible()
    await userEvent.click(region.getByRole('button', { name: 'Dismiss' }))
    await expect.poll(() => region.getByText('Could not archive').query()).toBeNull()
  })

  it('holds a required toast without a Dismiss until its CTA is pressed', async () => {
    const onStay = vi.fn()
    await renderWithProviders(<Toaster />)

    toast.show({ scope: 'required', severity: 'warning', title: 'Session ending', cta: { label: 'Stay signed in', onPress: onStay } })
    const region = page.getByRole('region', { name: /Notifications/ })
    await expect.element(region.getByText('Session ending')).toBeVisible()
    expect(region.getByRole('button', { name: 'Dismiss' }).query()).toBeNull()

    await userEvent.click(region.getByRole('button', { name: 'Stay signed in' }))
    expect(onStay).toHaveBeenCalledWith()
    await expect.poll(() => region.getByText('Session ending').query()).toBeNull()
  })
})
