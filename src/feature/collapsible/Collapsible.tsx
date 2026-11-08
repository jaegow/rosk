import { Collapsible as CollapsiblePrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'

import { Icon } from '@/feature/icon/Icon'

import { COLLAPSIBLE_SLOT } from './collapsibleSlot'

type CollapsibleProps = Omit<ComponentProps<typeof CollapsiblePrimitive.Root>, 'asChild' | 'className' | 'style'>

type CollapsibleTriggerProps = Omit<ComponentProps<typeof CollapsiblePrimitive.Trigger>, 'asChild' | 'className' | 'style' | 'children'> & {
  children: ReactNode
}

type CollapsibleContentProps = {
  children: ReactNode
}

const CollapsibleRoot = (props: CollapsibleProps) => (
  <CollapsiblePrimitive.Root
    data-slot={COLLAPSIBLE_SLOT.root}
    {...props}
  />
)

CollapsibleRoot.displayName = 'Collapsible'

const CollapsibleTrigger = ({ children, ...rest }: CollapsibleTriggerProps) => (
  <CollapsiblePrimitive.Trigger
    data-slot={COLLAPSIBLE_SLOT.trigger}
    className="group flex w-full cursor-pointer items-center gap-2 rounded-sm text-start focus-visible:focus-ring"
    {...rest}
  >
    {children}
    <span className="ms-auto inline-flex shrink-0 transition-transform group-data-[state=open]:rotate-180">
      <Icon name="chevron-down" />
    </span>
  </CollapsiblePrimitive.Trigger>
)

CollapsibleTrigger.displayName = 'Collapsible.Trigger'

const CollapsibleContent = ({ children }: CollapsibleContentProps) => (
  <CollapsiblePrimitive.Content
    data-slot={COLLAPSIBLE_SLOT.content}
    className="overflow-clip data-[state=closed]:animate-collapsible-close data-[state=open]:animate-collapsible-open"
  >
    {children}
  </CollapsiblePrimitive.Content>
)

CollapsibleContent.displayName = 'Collapsible.Content'

const Collapsible = Object.assign(CollapsibleRoot, {
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
})

export { Collapsible }
export type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps }
