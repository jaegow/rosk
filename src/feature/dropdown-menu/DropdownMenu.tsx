import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'

import { Icon } from '@/feature/icon/Icon'
import type { IconName } from '@/feature/icon/icon.util'
import { OverlaySurface } from '@/feature/popover/OverlaySurface'
import { cn } from '@/style/cn'
import { remToPixel } from '@/style/remToPixel'

import { DROPDOWN_MENU_SLOT } from './dropdownMenuSlot'

type DropdownMenuItemVariant = 'neutral' | 'danger'

type DropdownMenuProps = ComponentProps<typeof DropdownMenuPrimitive.Root>

type DropdownMenuTriggerProps = ComponentProps<typeof DropdownMenuPrimitive.Trigger>

type DropdownMenuContentProps = Omit<ComponentProps<typeof DropdownMenuPrimitive.Content>, 'asChild' | 'className' | 'style' | 'sideOffset'>

type DropdownMenuItemProps = Omit<ComponentProps<typeof DropdownMenuPrimitive.Item>, 'asChild' | 'className' | 'style' | 'children' | 'disabled'> & {
  children: ReactNode
  icon?: IconName
  variant?: DropdownMenuItemVariant
  unavailable?: boolean
}

type DropdownMenuCheckboxItemProps = Omit<ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>, 'asChild' | 'className' | 'style' | 'children' | 'disabled'> & {
  children: ReactNode
}

type DropdownMenuLabelProps = {
  children: ReactNode
}

const DropdownMenuRoot = (props: DropdownMenuProps) => <DropdownMenuPrimitive.Root {...props} />

DropdownMenuRoot.displayName = 'DropdownMenu'

const DropdownMenuTrigger = ({ asChild = false, ...rest }: DropdownMenuTriggerProps) => (
  <DropdownMenuPrimitive.Trigger
    asChild={asChild}
    {...(asChild ? {} : { 'data-slot': DROPDOWN_MENU_SLOT.trigger })}
    {...rest}
  />
)

DropdownMenuTrigger.displayName = 'DropdownMenu.Trigger'

const DropdownMenuContent = ({ children, align = 'start', ...rest }: DropdownMenuContentProps) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      asChild
      data-slot={DROPDOWN_MENU_SLOT.content}
      align={align}
      sideOffset={remToPixel(0.25)}
      collisionPadding={remToPixel(0.5)}
      {...rest}
    >
      <OverlaySurface
        layer="dropdown"
        density="sm"
      >
        <div className="flex min-w-48 flex-col py-1">
          {children}
        </div>
      </OverlaySurface>
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
)

DropdownMenuContent.displayName = 'DropdownMenu.Content'

const DropdownMenuItem = ({ children, icon, variant = 'neutral', unavailable = false, ...rest }: DropdownMenuItemProps) => (
  <DropdownMenuPrimitive.Item
    data-slot={DROPDOWN_MENU_SLOT.item}
    aria-disabled={unavailable || undefined}
    className={cn(
      'flex h-8 cursor-pointer items-center gap-2 rounded-sm px-2 text-body2 text-stress outline-none select-none focus-visible:focus-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-60 data-highlighted:stress-hover',
      ({
        neutral: '',
        danger: '[&>[data-slot=icon]]:text-danger',
      } satisfies Record<DropdownMenuItemVariant, string>)[variant],
    )}
    {...rest}
  >
    {icon !== undefined && (
      <Icon
        name={icon}
        size="sm"
      />
    )}
    <span className="min-w-0 truncate">{children}</span>
  </DropdownMenuPrimitive.Item>
)

DropdownMenuItem.displayName = 'DropdownMenu.Item'

const DropdownMenuCheckboxItem = ({ children, ...rest }: DropdownMenuCheckboxItemProps) => (
  <DropdownMenuPrimitive.CheckboxItem
    data-slot={DROPDOWN_MENU_SLOT.checkboxItem}
    className="flex h-8 cursor-pointer items-center gap-2 rounded-sm px-2 text-body2 text-stress outline-none select-none focus-visible:focus-ring data-highlighted:stress-hover"
    {...rest}
  >
    <span className="inline-flex size-4 shrink-0 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Icon
          name="check"
          size="sm"
        />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    <span className="min-w-0 truncate">{children}</span>
  </DropdownMenuPrimitive.CheckboxItem>
)

DropdownMenuCheckboxItem.displayName = 'DropdownMenu.CheckboxItem'

const DropdownMenuSeparator = () => (
  <DropdownMenuPrimitive.Separator
    data-slot={DROPDOWN_MENU_SLOT.separator}
    className="my-1 h-px bg-stress-outline"
  />
)

DropdownMenuSeparator.displayName = 'DropdownMenu.Separator'

const DropdownMenuLabel = ({ children }: DropdownMenuLabelProps) => (
  <DropdownMenuPrimitive.Label
    data-slot={DROPDOWN_MENU_SLOT.label}
    className="px-2 py-1 text-caption text-stress-xl"
  >
    {children}
  </DropdownMenuPrimitive.Label>
)

DropdownMenuLabel.displayName = 'DropdownMenu.Label'

const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
})

export { DropdownMenu }
export type { DropdownMenuCheckboxItemProps, DropdownMenuContentProps, DropdownMenuItemProps, DropdownMenuItemVariant, DropdownMenuLabelProps, DropdownMenuProps, DropdownMenuTriggerProps }
