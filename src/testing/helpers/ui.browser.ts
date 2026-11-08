import i18next from 'i18next'
import { expect } from 'vitest'
import { type Locator, type LocatorSelectors, page, userEvent } from 'vitest/browser'

import type { CTAVariant } from '@/feature/cta/cta.type'

import { type ToastMatch, toastRaised } from './toastRaised'

type Name = string | RegExp

const settled = async (locator: Locator): Promise<HTMLElement> => {
  await expect.element(locator).toBeInTheDocument()
  return locator.element() as HTMLElement
}

const ui_cta = (name: Name, within: LocatorSelectors = page) => {
  const locator = within.getByRole('button', { name }).or(within.getByRole('link', { name }))
  return {
    locator,
    isUnavailable: async () => (await settled(locator)).getAttribute('aria-disabled') === 'true',
    isBusy: async () => (await settled(locator)).getAttribute('aria-busy') === 'true',
    variant: async () => (await settled(locator)).dataset.ctaVariant as CTAVariant | undefined,
    press: async () => {
      const element = await settled(locator)
      if (element.getAttribute('aria-disabled') !== 'true') return userEvent.click(locator)
      element.focus()
      await expect.element(locator).toHaveFocus()
      return userEvent.keyboard('{Enter}')
    },
  }
}

const ui_field = (label: Name, within: LocatorSelectors = page) => {
  const locator = within.getByLabelText(label)
  return {
    locator,
    value: async () => ((await settled(locator)) as HTMLInputElement).value,
    isInvalid: async () => (await settled(locator)).getAttribute('aria-invalid') === 'true',
    description: async () => {
      const element = await settled(locator)
      return (element.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean)
        .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
        .filter(Boolean)
        .join(' ')
    },
    fill: (value: string) => userEvent.fill(locator, value),
    clear: () => userEvent.clear(locator),
  }
}

const ui_dialog = (name: Name) => {
  const locator = page.getByRole('dialog', { name }).or(page.getByRole('alertdialog', { name }))
  return {
    locator,
    cta: (ctaName: Name) => ui_cta(ctaName, locator),
    field: (label: Name) => ui_field(label, locator),
    escape: async () => {
      await expect.element(locator).toBeVisible()
      return userEvent.keyboard('{Escape}')
    },
  }
}

const ui_toast = () => {
  const regionName = new RegExp(`^${i18next.t('common.toast.region').split('{')[0]?.trim() ?? ''}`)
  const region = page.getByRole('region', { name: regionName })
  return {
    region,
    shown: (title: Name) => region.getByText(title, { exact: typeof title === 'string' }),
    raised: (match?: ToastMatch) => toastRaised(match),
    raisedCount: (match?: ToastMatch) => toastRaised(match).length,
    cta: (title: Name, ctaName: Name) => ui_cta(ctaName, region.getByRole('listitem').filter({ hasText: title })),
  }
}

export { ui_cta, ui_dialog, ui_field, ui_toast }
