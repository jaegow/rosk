import { Tooltip as TooltipPrimitive } from 'radix-ui'
import type { ComponentProps, ReactElement, ReactNode } from 'react'

import { OverlaySurface } from '@/feature/popover/OverlaySurface'
import { remToPixel } from '@/style/remToPixel'

import { TOOLTIP_SLOT } from './tooltipSlot'

type TooltipContentShape =
  | { label: string, children: ReactElement }
  | { label?: undefined, children: ReactNode }

type TooltipProps = Omit<ComponentProps<typeof TooltipPrimitive.Root>, 'children'> & TooltipContentShape

type TooltipTriggerProps = ComponentProps<typeof TooltipPrimitive.Trigger>

type TooltipContentProps = Omit<ComponentProps<typeof TooltipPrimitive.Content>, 'asChild' | 'className' | 'style' | 'sideOffset'>

const TooltipTrigger = ({ asChild = false, onFocus, ...rest }: TooltipTriggerProps) => (
  <TooltipPrimitive.Trigger
    asChild={asChild}
    {...(asChild ? {} : { 'data-slot': TOOLTIP_SLOT.trigger, 'type': 'button' as const })}
    {...rest}
    onFocus={(event) => {
      onFocus?.(event)
      if (!event.currentTarget.matches(':focus-visible')) event.preventDefault()
    }}
  />
)

TooltipTrigger.displayName = 'Tooltip.Trigger'

const TooltipContent = ({ children, ...rest }: TooltipContentProps) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      asChild
      data-slot={TOOLTIP_SLOT.content}
      sideOffset={remToPixel(0.375)}
      collisionPadding={remToPixel(0.5)}
      {...rest}
    >
      <OverlaySurface
        layer="tooltip"
        density="sm"
      >
        {children}
      </OverlaySurface>
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
)

TooltipContent.displayName = 'Tooltip.Content'

const TooltipRoot = ({ label, children, delayDuration = import.meta.env.MODE === 'test' ? 0 : 500, ...rest }: TooltipProps) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration}>
    <TooltipPrimitive.Root {...rest}>
      {label === undefined
        ? children
        : (
          <>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </>
        )}
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
)

TooltipRoot.displayName = 'Tooltip'

const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
})

export { Tooltip }
export type { TooltipContentProps, TooltipProps, TooltipTriggerProps }
