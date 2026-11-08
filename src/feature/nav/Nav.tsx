import { type ReactNode, useContext, useId } from 'react'
import { Link } from 'react-router'

import { useCopy } from '@/feature/copy/useCopy'
import { Icon } from '@/feature/icon/Icon'
import type { IconName } from '@/feature/icon/icon.util'
import { useRoute } from '@/feature/route/useRoute'
import { cn } from '@/style/cn'

import type { NavRoute, NavVariant } from './nav.type'
import { NavVariantContext } from './navContext'
import { NAV_SLOT } from './navSlot'

type NavProps = {
  label: string
  variant?: NavVariant
  children: ReactNode
}

type NavGroupProps = {
  label: string
  children: ReactNode
}

type NavItemProps = {
  route: NavRoute
  icon?: IconName
}

const NavRoot = ({ label, variant = 'side', children }: NavProps) => (
  <NavVariantContext.Provider value={variant}>
    <nav
      data-slot={NAV_SLOT.root}
      data-nav-variant={variant}
      aria-label={label}
    >
      <ul
        data-slot={NAV_SLOT.list}
        className={cn('flex gap-1', ({
          side: 'flex-col',
          top: 'flex-row flex-wrap items-center',
        } satisfies Record<NavVariant, string>)[variant])}
      >
        {children}
      </ul>
    </nav>
  </NavVariantContext.Provider>
)

NavRoot.displayName = 'Nav'

const NavGroup = ({ label, children }: NavGroupProps) => {
  const variant = useContext(NavVariantContext)
  const labelId = useId()

  return (
    <li
      data-slot={NAV_SLOT.group}
      className={cn('flex gap-1', ({
        side: 'flex-col pt-3 first:pt-0',
        top: 'flex-row items-center',
      } satisfies Record<NavVariant, string>)[variant])}
    >
      <span
        id={labelId}
        data-slot={NAV_SLOT.groupLabel}
        className="px-3 text-caption text-stress-xl"
      >
        {label}
      </span>
      <ul
        aria-labelledby={labelId}
        className={cn('flex gap-1', ({
          side: 'flex-col',
          top: 'flex-row items-center',
        } satisfies Record<NavVariant, string>)[variant])}
      >
        {children}
      </ul>
    </li>
  )
}

NavGroup.displayName = 'Nav.Group'

const NavItem = ({ route, icon }: NavItemProps) => {
  const { t } = useCopy()
  const currentRoute = useRoute()
  const active = currentRoute.isActive(route)

  return (
    <li data-slot={NAV_SLOT.item}>
      <Link
        data-slot={NAV_SLOT.itemCTA}
        to={currentRoute.href(route)}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex h-9 min-w-0 items-center gap-2 rounded-md px-3 whitespace-nowrap focus-visible:focus-ring',
          active ? 'stress-selected text-subtitle2 text-stress' : 'text-body2 text-stress-xxl hover:stress-hover hover:text-stress',
        )}
      >
        {icon !== undefined && (
          <Icon
            name={icon}
            size="sm"
          />
        )}
        <span className="min-w-0 truncate">
          {((): string => {
            switch (route) {
              case 'home': return t('common.nav.home')
              case 'items': return t('common.nav.items')
              case 'gallery': return t('common.nav.gallery')
              case 'galleryTokens': return t('common.gallery.tokens')
            }
          })()}
        </span>
      </Link>
    </li>
  )
}

NavItem.displayName = 'Nav.Item'

const Nav = Object.assign(NavRoot, {
  Group: NavGroup,
  Item: NavItem,
})

export { Nav }
export type { NavGroupProps, NavItemProps, NavProps }
