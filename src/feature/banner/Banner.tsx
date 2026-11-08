import type { ReactNode } from 'react'

import { useCopy } from '@/feature/copy/useCopy'
import { CTA } from '@/feature/cta/CTA'
import type { CTAPlacedProps } from '@/feature/cta/cta.type'
import { cn } from '@/style/cn'

import { BANNER_SLOT } from './bannerSlot'

type BannerVariant = 'info' | 'warning'

type BannerProps = {
  variant?: BannerVariant
  message: ReactNode
  onDismiss?: () => void
  children?: ReactNode
}

const BannerRoot = ({ variant = 'info', message, onDismiss, children }: BannerProps) => {
  const { t } = useCopy()

  return (
    <div
      data-slot={BANNER_SLOT.root}
      data-variant={variant}
      className={cn('grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-3 border-b px-gutter py-2 text-body2', ({
        info: 'border-info bg-info stress-xl-inverse text-stress',
        warning: 'border-warning bg-warning stress-xl-inverse text-stress',
      } satisfies Record<BannerVariant, string>)[variant])}
    >
      <div
        data-slot={BANNER_SLOT.message}
        className="col-start-2 min-w-0 text-center"
      >
        {message}
      </div>
      <div
        data-slot={BANNER_SLOT.ctas}
        className="col-start-3 flex flex-wrap items-center justify-end gap-2"
      >
        {children}
        {onDismiss !== undefined && (
          <CTA
            data-slot={BANNER_SLOT.dismissCTA}
            variant="tertiary"
            size="sm"
            iconOnly="close"
            aria-label={t('common.actions.dismiss')}
            onClick={() => onDismiss()}
          />
        )}
      </div>
    </div>
  )
}

BannerRoot.displayName = 'Banner'

const BannerCTA = (props: CTAPlacedProps) => (
  <CTA
    data-slot={BANNER_SLOT.cta}
    variant="secondary"
    size="sm"
    {...props}
  />
)

BannerCTA.displayName = 'Banner.CTA'

const Banner = Object.assign(BannerRoot, {
  CTA: BannerCTA,
})

export { Banner }
export type { BannerProps, BannerVariant }
