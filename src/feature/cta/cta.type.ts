import type { ComponentProps, ReactElement, ReactNode } from 'react'

import type { IconName } from '@/feature/icon/icon.util'

type CTAVariant = 'primary' | 'secondary' | 'tertiary' | 'danger'

type CTASize = 'sm' | 'md' | 'lg'

type CTAIcon = {
  start?: IconName
  end?: IconName
}

type CTAContent =
  | { iconOnly?: undefined, icon?: CTAIcon, children: ReactNode, 'aria-label'?: string }
  | { iconOnly: IconName, icon?: undefined, children?: undefined, 'aria-label': string }

type CTAButtonAttributes = Omit<ComponentProps<'button'>, 'children' | 'aria-label' | 'disabled' | 'aria-disabled' | 'aria-busy'>

type CTAElement =
  | CTAButtonAttributes & { asChild?: false, href?: undefined, loading?: boolean }
  | Omit<ComponentProps<'a'>, 'children' | 'aria-label' | 'aria-disabled' | 'aria-busy' | 'href'> & { asChild?: false, href: string, loading?: undefined }
  | CTAButtonAttributes & { asChild: true, href?: undefined, loading?: undefined, children: ReactElement }

type CTAProps = {
  variant?: CTAVariant
  size?: CTASize
  unavailable?: boolean
} & CTAContent & CTAElement

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

type CTAPlacedProps = DistributiveOmit<CTAProps, 'variant' | 'size'>

type CTALane = 'tertiary' | 'secondary' | 'primary'

export type { CTAIcon, CTALane, CTAPlacedProps, CTAProps, CTASize, CTAVariant, DistributiveOmit }
