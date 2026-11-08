import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { renderWithProviders } from '@/testing/render.browser'

import { Tabs } from './Tabs'

describe('Tabs', () => {
  it('switches panels by press and by arrow keys', async () => {
    const screen = await renderWithProviders(
      <Tabs
        variant="pill"
        defaultValue="overview"
      >
        <Tabs.List aria-label="Item Views">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">Summary of the item</Tabs.Content>
        <Tabs.Content value="activity">Recent changes</Tabs.Content>
      </Tabs>,
    )

    await expect.element(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Summary of the item')

    await userEvent.click(screen.getByRole('tab', { name: 'Activity' }))
    await expect.element(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true')
    await expect.element(screen.getByRole('tabpanel', { name: 'Activity' })).toHaveTextContent('Recent changes')

    await userEvent.keyboard('{ArrowLeft}')
    await expect.element(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus()
    await expect.element(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Summary of the item')
  })

  it('keeps an unavailable tab focusable but never opens its panel', async () => {
    const screen = await renderWithProviders(
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="Item Views">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger
            value="activity"
            unavailable
          >
            Activity
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">Summary of the item</Tabs.Content>
        <Tabs.Content value="activity">Recent changes</Tabs.Content>
      </Tabs>,
    )
    const activity = screen.getByRole('tab', { name: 'Activity' })

    await userEvent.click(screen.getByRole('tab', { name: 'Overview' }))
    await userEvent.keyboard('{ArrowRight}')
    await expect.element(activity).toHaveFocus()
    await expect.element(activity).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{Enter}')
    await expect.element(activity).toHaveAttribute('aria-selected', 'false')
    await expect.element(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Summary of the item')
  })
})
