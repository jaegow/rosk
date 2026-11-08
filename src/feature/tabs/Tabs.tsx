import { Tabs as TabsPrimitive } from 'radix-ui'
import { type ComponentProps, type KeyboardEvent, type ReactNode, type SyntheticEvent, useContext } from 'react'

import { cn } from '@/style/cn'

import type { TabsVariant } from './tabs.type'
import { TabsVariantContext } from './tabsContext'
import { TABS_SLOT } from './tabsSlot'

type TabsProps = Omit<ComponentProps<typeof TabsPrimitive.Root>, 'asChild' | 'className' | 'style'> & {
  variant?: TabsVariant
}

type TabsListProps = Omit<ComponentProps<typeof TabsPrimitive.List>, 'asChild' | 'className' | 'style'>

type TabsTriggerProps = Omit<ComponentProps<typeof TabsPrimitive.Trigger>, 'asChild' | 'className' | 'style' | 'children' | 'disabled'> & {
  children: ReactNode
  unavailable?: boolean
}

type TabsContentProps = Omit<ComponentProps<typeof TabsPrimitive.Content>, 'asChild' | 'className' | 'style'>

const TabsRoot = ({ variant = 'line', ...rest }: TabsProps) => (
  <TabsVariantContext.Provider value={variant}>
    <TabsPrimitive.Root
      data-slot={TABS_SLOT.root}
      className="contents"
      {...rest}
    />
  </TabsVariantContext.Provider>
)

TabsRoot.displayName = 'Tabs'

const TabsList = (props: TabsListProps) => {
  const variant = useContext(TabsVariantContext)

  return (
    <TabsPrimitive.List
      data-slot={TABS_SLOT.list}
      className={cn('flex items-center', ({
        line: 'gap-4 border-b border-stress-outline',
        pill: 'w-fit gap-1 rounded-md bg-base stress-xs p-1',
      } satisfies Record<TabsVariant, string>)[variant])}
      {...props}
    />
  )
}

TabsList.displayName = 'Tabs.List'

const TabsTrigger = ({ unavailable = false, ...rest }: TabsTriggerProps) => {
  const variant = useContext(TabsVariantContext)
  const swallow = (event: SyntheticEvent) => event.preventDefault()

  return (
    <TabsPrimitive.Trigger
      data-slot={TABS_SLOT.trigger}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 text-subtitle2 whitespace-nowrap text-stress-xl hover:text-stress focus-visible:focus-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-60 data-[state=active]:text-stress',
        ({
          line: '-mb-px h-10 border-b-2 border-transparent px-1 data-[state=active]:border-brand',
          pill: 'h-8 rounded-sm px-3 hover:stress-hover data-[state=active]:bg-base data-[state=active]:shadow-sm',
        } satisfies Record<TabsVariant, string>)[variant],
      )}
      {...rest}
      {...(unavailable
        ? { 'aria-disabled': true, onMouseDown: swallow, onKeyDown: (event: KeyboardEvent) => [' ', 'Enter'].includes(event.key) && swallow(event), onFocus: swallow }
        : {})}
    />
  )
}

TabsTrigger.displayName = 'Tabs.Trigger'

const TabsContent = (props: TabsContentProps) => (
  <TabsPrimitive.Content
    data-slot={TABS_SLOT.content}
    className="rounded-sm focus-visible:focus-ring"
    {...props}
  />
)

TabsContent.displayName = 'Tabs.Content'

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
})

export { Tabs }
export type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps }
