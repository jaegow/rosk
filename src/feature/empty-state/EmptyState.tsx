import { type ReactNode, useContext } from 'react'

import { CTA } from '@/feature/cta/CTA'
import type { CTAPlacedProps } from '@/feature/cta/cta.type'
import { Icon } from '@/feature/icon/Icon'
import type { IconName } from '@/feature/icon/icon.util'
import type { HeadingLevel } from '@/feature/layout/layout.type'
import { HeadingLevelContext } from '@/feature/layout/layoutContext'

import { EMPTY_STATE_SLOT } from './emptyStateSlot'

type EmptyStateProps = {
  icon?: IconName
  title: string
  message?: string
  children?: ReactNode
}

const EmptyStateRoot = ({ icon, title, message, children }: EmptyStateProps) => {
  const level = useContext(HeadingLevelContext)
  const Heading = ({ 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const satisfies Record<HeadingLevel, string>)[level]

  return (
    <div
      data-slot={EMPTY_STATE_SLOT.root}
      className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-stress-outline px-inset py-8 text-center"
    >
      {icon !== undefined && (
        <span
          data-slot={EMPTY_STATE_SLOT.icon}
          className="text-stress-xl"
        >
          <Icon
            name={icon}
            size="lg"
          />
        </span>
      )}
      <Heading
        data-slot={EMPTY_STATE_SLOT.title}
        className="text-subtitle1 text-stress"
      >
        {title}
      </Heading>
      {message !== undefined && (
        <p
          data-slot={EMPTY_STATE_SLOT.message}
          className="max-w-prose text-body2 text-stress-xxl"
        >
          {message}
        </p>
      )}
      {children !== undefined && (
        <div
          data-slot={EMPTY_STATE_SLOT.ctas}
          className="mt-2 flex flex-wrap items-center justify-center gap-2"
        >
          {children}
        </div>
      )}
    </div>
  )
}

EmptyStateRoot.displayName = 'EmptyState'

const EmptyStateCTA = (props: CTAPlacedProps) => (
  <CTA
    data-slot={EMPTY_STATE_SLOT.cta}
    variant="secondary"
    size="md"
    {...props}
  />
)

EmptyStateCTA.displayName = 'EmptyState.CTA'

const EmptyState = Object.assign(EmptyStateRoot, {
  CTA: EmptyStateCTA,
})

export { EmptyState }
export type { EmptyStateProps }
