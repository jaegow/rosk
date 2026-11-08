import { type BoundFunctions, type queries, screen, waitFor } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import { expect } from 'vitest'

import type { CTAVariant } from '@/feature/cta/cta.type'

import { type ToastMatch, toastRaised } from './toastRaised'

type Name = string | RegExp

type Within = BoundFunctions<typeof queries>

const ui_cta = (name: Name, within: Within = screen) => {
  const find = () => waitFor(() => within.queryByRole('button', { name }) ?? within.getByRole('link', { name }))
  return {
    find,
    isUnavailable: async () => (await find()).getAttribute('aria-disabled') === 'true',
    isBusy: async () => (await find()).getAttribute('aria-busy') === 'true',
    variant: async () => (await find()).dataset.ctaVariant as CTAVariant | undefined,
    press: async (user: UserEvent) => {
      const element = await find()
      if (element.getAttribute('aria-disabled') !== 'true') return user.click(element)
      element.focus()
      await waitFor(() => expect(element).toHaveFocus())
      return user.keyboard('{Enter}')
    },
  }
}

const ui_field = (label: Name, within: Within = screen) => {
  const find = () => within.findByLabelText(label)
  return {
    find,
    value: async () => ((await find()) as HTMLInputElement).value,
    isInvalid: async () => (await find()).getAttribute('aria-invalid') === 'true',
    description: async () => {
      const element = await find()
      return (element.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean)
        .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
        .filter(Boolean)
        .join(' ')
    },
    fill: async (user: UserEvent, value: string) => {
      const element = await find()
      await user.clear(element)
      return user.type(element, value)
    },
  }
}

const ui_toast = () => ({
  raised: (match?: ToastMatch) => toastRaised(match),
  raisedCount: (match?: ToastMatch) => toastRaised(match).length,
})

export { ui_cta, ui_field, ui_toast }
