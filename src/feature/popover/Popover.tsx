import { Popover as PopoverPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'

import { useCopy } from '@/feature/copy/useCopy'
import { CTA } from '@/feature/cta/CTA'
import { remToPixel } from '@/style/remToPixel'

import { OverlaySurface } from './OverlaySurface'
import { POPOVER_SLOT } from './popoverSlot'

type PopoverProps = ComponentProps<typeof PopoverPrimitive.Root>

type PopoverTriggerProps = ComponentProps<typeof PopoverPrimitive.Trigger>

type PopoverContentProps = Omit<ComponentProps<typeof PopoverPrimitive.Content>, 'asChild' | 'className' | 'style' | 'sideOffset'>

const PopoverRoot = (props: PopoverProps) => <PopoverPrimitive.Root {...props} />

PopoverRoot.displayName = 'Popover'

const PopoverTrigger = ({ asChild = false, ...rest }: PopoverTriggerProps) => (
  <PopoverPrimitive.Trigger
    asChild={asChild}
    {...(asChild ? {} : { 'data-slot': POPOVER_SLOT.trigger })}
    {...rest}
  />
)

PopoverTrigger.displayName = 'Popover.Trigger'

const PopoverContent = ({ children, ...rest }: PopoverContentProps) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      asChild
      data-slot={POPOVER_SLOT.content}
      sideOffset={remToPixel(0.25)}
      collisionPadding={remToPixel(0.5)}
      {...rest}
    >
      <OverlaySurface layer="popover">
        {children}
      </OverlaySurface>
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
)

PopoverContent.displayName = 'Popover.Content'

const PopoverClose = () => {
  const { t } = useCopy()

  return (
    <PopoverPrimitive.Close asChild>
      <CTA
        data-slot={POPOVER_SLOT.closeCTA}
        variant="tertiary"
        size="sm"
        iconOnly="close"
        aria-label={t('common.actions.close')}
      />
    </PopoverPrimitive.Close>
  )
}

PopoverClose.displayName = 'Popover.Close'

const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
})

export { Popover }
export type { PopoverContentProps, PopoverProps, PopoverTriggerProps }
