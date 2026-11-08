import type { ComponentProps } from 'react'

import { cn } from '@/style/cn'

import { POPOVER_SLOT } from './popoverSlot'

type OverlayLayer = 'popover' | 'dropdown' | 'tooltip'

type OverlayDensity = 'sm' | 'md'

type OverlaySurfaceProps = Omit<ComponentProps<'div'>, 'className' | 'style'> & {
  layer: OverlayLayer
  density?: OverlayDensity
}

const OverlaySurface = ({ layer, density = 'md', ...rest }: OverlaySurfaceProps) => (
  <div
    data-slot={POPOVER_SLOT.surface}
    {...rest}
    className={cn(
      'animate-fade-in rounded-md border border-stress-outline bg-base text-stress shadow-lg',
      ({
        popover: 'z-popover',
        dropdown: 'z-dropdown',
        tooltip: 'z-tooltip',
      } satisfies Record<OverlayLayer, string>)[layer],
      ({
        sm: 'max-w-xs px-2 py-1 text-body3',
        md: 'p-inset text-body2',
      } satisfies Record<OverlayDensity, string>)[density],
    )}
  />
)

OverlaySurface.displayName = 'OverlaySurface'

export { OverlaySurface }
export type { OverlayDensity, OverlayLayer, OverlaySurfaceProps }
