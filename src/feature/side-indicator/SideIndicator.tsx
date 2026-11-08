import { type ReactNode, useContext } from 'react'

import { cn } from '@/style/cn'

import { SideIndicatorEnclosedContext } from './sideIndicatorContext'
import { SIDE_INDICATOR_SLOT } from './sideIndicatorSlot'

type SideIndicatorVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

type SideIndicatorProps = {
  variant: SideIndicatorVariant
}

type SideIndicatorEnclosingProps = {
  children: ReactNode
}

const SideIndicatorRoot = ({ variant }: SideIndicatorProps) => {
  const enclosed = useContext(SideIndicatorEnclosedContext)
  if (enclosed) return null

  return (
    <span
      data-slot={SIDE_INDICATOR_SLOT.root}
      data-variant={variant}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-y-0 start-0 border-s-3', ({
        neutral: 'border-stress-md',
        info: 'border-info',
        success: 'border-success',
        warning: 'border-warning',
        danger: 'border-danger',
      } satisfies Record<SideIndicatorVariant, string>)[variant])}
    />
  )
}

SideIndicatorRoot.displayName = 'SideIndicator'

const SideIndicatorEnclosing = ({ children }: SideIndicatorEnclosingProps) => (
  <SideIndicatorEnclosedContext.Provider value>
    {children}
  </SideIndicatorEnclosedContext.Provider>
)

SideIndicatorEnclosing.displayName = 'SideIndicator.Enclosing'

const SideIndicator = Object.assign(SideIndicatorRoot, {
  Enclosing: SideIndicatorEnclosing,
})

export { SideIndicator }
export type { SideIndicatorEnclosingProps, SideIndicatorProps, SideIndicatorVariant }
