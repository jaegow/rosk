import { Children, isValidElement, type ReactNode } from 'react'

import { CTA } from './CTA'
import type { CTALane, CTAProps } from './cta.type'
import { CTA_BAR_SLOT } from './ctaSlot'

type CTABarCTAProps = CTAProps & { lane: CTALane }

type CTABarProps = {
  children: ReactNode
}

const CTABarCTA = ({ lane, ...rest }: CTABarCTAProps) => (
  <CTA
    data-slot={CTA_BAR_SLOT.cta}
    data-cta-lane={lane}
    {...rest}
  />
)

CTABarCTA.displayName = 'CTABar.CTA'

const CTABarRoot = ({ children }: CTABarProps) => {
  const ranked = Children.toArray(children).map((child) => ({
    child,
    lane: isValidElement<CTABarCTAProps>(child) && child.type === CTABarCTA ? child.props.lane : 'tertiary',
  }))

  return (
    <div
      data-slot={CTA_BAR_SLOT.root}
      className="flex flex-wrap items-center gap-3"
    >
      <div
        data-slot={CTA_BAR_SLOT.tertiaryCTAs}
        className="me-auto flex flex-wrap items-center gap-3"
      >
        {ranked.filter((entry) => entry.lane === 'tertiary').map((entry) => entry.child)}
      </div>
      <div
        data-slot={CTA_BAR_SLOT.closingCTAs}
        className="flex flex-wrap items-center justify-end gap-3"
      >
        {ranked.filter((entry) => entry.lane === 'secondary').map((entry) => entry.child)}
        {ranked.filter((entry) => entry.lane === 'primary').map((entry) => entry.child)}
      </div>
    </div>
  )
}

CTABarRoot.displayName = 'CTABar'

const CTABar = Object.assign(CTABarRoot, {
  CTA: CTABarCTA,
})

export { CTABar }
export type { CTABarCTAProps, CTABarProps }
