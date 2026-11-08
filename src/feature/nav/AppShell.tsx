import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { useCopy } from '@/feature/copy/useCopy'
import { CTA } from '@/feature/cta/CTA'
import { DropdownMenu } from '@/feature/dropdown-menu/DropdownMenu'
import { hrefFor } from '@/feature/route/sitemap'
import { useThemeMode } from '@/style/useThemeMode'

import { Nav } from './Nav'

type AppShellProps = {
  children: ReactNode
}

const AppShell = ({ children }: AppShellProps) => {
  const { t } = useCopy()
  const themeMode = useThemeMode()

  return (
    <div className="grid min-h-dvh grid-cols-[14rem_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] bg-base text-stress">
      <header className="col-span-2 flex items-center justify-between gap-3 border-b border-stress-outline px-gutter py-2">
        <Link
          to={hrefFor('home')}
          className="rounded-sm text-subtitle1 text-stress focus-visible:focus-ring"
        >
          {t('common.appName')}
        </Link>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <CTA
              variant="tertiary"
              iconOnly={themeMode.mode === 'dark' ? 'moon' : 'sun'}
              aria-label={t('common.theme.label')}
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.CheckboxItem
              checked={themeMode.mode === 'light'}
              onCheckedChange={() => themeMode.setMode('light')}
            >
              {t('common.theme.light')}
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem
              checked={themeMode.mode === 'dark'}
              onCheckedChange={() => themeMode.setMode('dark')}
            >
              {t('common.theme.dark')}
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem
              checked={themeMode.mode === 'system'}
              onCheckedChange={() => themeMode.setMode('system')}
            >
              {t('common.theme.system')}
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu>
      </header>
      <aside className="border-e border-stress-outline p-3">
        <Nav label={t('common.nav.label')}>
          <Nav.Item
            route="home"
            icon="home"
          />
          <Nav.Item
            route="items"
            icon="menu"
          />
          <Nav.Item
            route="gallery"
            icon="eye"
          />
        </Nav>
      </aside>
      <div className="min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

AppShell.displayName = 'AppShell'

export { AppShell }
export type { AppShellProps }
