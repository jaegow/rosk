import { Children, type ComponentProps, isValidElement, type ReactElement, type ReactNode, useContext } from 'react'

import { Alert, type AlertProps } from '@/feature/alert/Alert'
import type { Severity } from '@/feature/alert/alert.type'
import { Chip, type ChipProps } from '@/feature/chip/Chip'
import { CTA } from '@/feature/cta/CTA'
import type { CTALane, CTAPlacedProps, CTAProps, CTAVariant, DistributiveOmit } from '@/feature/cta/cta.type'
import { CTABar } from '@/feature/cta/CTABar'
import { cn } from '@/style/cn'

import type { HeadingLevel, LayoutInset, LayoutVariant } from './layout.type'
import { footCTASize, footCTAVariant } from './layout.util'
import { LayoutFrameContext } from './layoutContext'
import { layoutSlot } from './layoutSlot'
import { LoadingBar } from './LoadingBar'

type LayoutHeadProps = {
  children: ReactNode
}

type LayoutHeadTitleProps = Omit<ComponentProps<'h2'>, 'className' | 'style' | 'children'> & {
  children: ReactNode
}

type LayoutHeadSubtitleProps = Omit<ComponentProps<'p'>, 'className' | 'style' | 'children'> & {
  children: ReactNode
}

type LayoutHeadCTAsProps = {
  children: ReactNode
}

type LayoutHeadTabsProps = {
  children: ReactNode
}

type LayoutHeadStatusProps = AlertProps

type LayoutContentProps = {
  children: ReactNode
}

type LayoutFootProps = {
  children: ReactNode
}

type LayoutFootCTAProps = DistributiveOmit<CTAProps, 'size' | 'variant'> & {
  lane: CTALane
  variant?: CTAVariant
}

const LayoutHeadStatus = (_props: LayoutHeadStatusProps): ReactNode => null

LayoutHeadStatus.displayName = 'Layout.Head.Status'

const LayoutHeadRoot = ({ children }: LayoutHeadProps) => {
  const frame = useContext(LayoutFrameContext)
  const parts = Children.toArray(children)
  const isStatus = (part: ReactNode): part is ReactElement<LayoutHeadStatusProps> => isValidElement(part) && part.type === LayoutHeadStatus
  const urgency = { danger: 0, warning: 1, info: 2, success: 3 } satisfies Record<Severity, number>
  const shown = parts
    .filter(isStatus)
    .map((part) => part.props)
    .toSorted((first, second) => urgency[first.severity ?? 'info'] - urgency[second.severity ?? 'info'])
    .at(0)

  return (
    <div
      data-slot={layoutSlot(frame.variant, 'head')}
      className={cn('flex flex-wrap items-center gap-x-3 gap-y-1', ({
        none: 'pb-3',
        sm: 'px-3 pt-3 [--bleed:calc(var(--spacing)*3)]',
        md: 'px-inset pt-inset [--bleed:var(--spacing-inset)]',
        lg: 'px-gutter pt-gutter [--bleed:var(--spacing-gutter)]',
      } satisfies Record<LayoutInset, string>)[frame.inset])}
    >
      {parts.filter((part) => !isStatus(part))}
      {shown !== undefined && (
        <div
          data-slot={layoutSlot(frame.variant, 'headStatus')}
          className="order-6 basis-full full-bleed"
        >
          <Alert {...shown} />
        </div>
      )}
    </div>
  )
}

LayoutHeadRoot.displayName = 'Layout.Head'

const LayoutHeadTitle = ({ id, children, ...rest }: LayoutHeadTitleProps) => {
  const frame = useContext(LayoutFrameContext)
  const Heading = ({ 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const satisfies Record<HeadingLevel, string>)[frame.titleLevel]

  return (
    <Heading
      data-slot={layoutSlot(frame.variant, 'headTitle')}
      id={id ?? frame.titleId}
      className={cn('order-1 min-w-0 break-words text-stress', ({
        card: 'text-subtitle1',
        modal: 'text-h5',
        page: 'text-h3',
      } satisfies Record<LayoutVariant, string>)[frame.variant])}
      {...rest}
    >
      {children}
    </Heading>
  )
}

LayoutHeadTitle.displayName = 'Layout.Head.Title'

const LayoutHeadSubtitle = ({ children, ...rest }: LayoutHeadSubtitleProps) => {
  const frame = useContext(LayoutFrameContext)

  return (
    <p
      data-slot={layoutSlot(frame.variant, 'headSubtitle')}
      className="order-4 basis-full text-body2 text-stress-xxl"
      {...rest}
    >
      {children}
    </p>
  )
}

LayoutHeadSubtitle.displayName = 'Layout.Head.Subtitle'

const LayoutHeadChip = (props: ChipProps) => {
  const frame = useContext(LayoutFrameContext)

  return (
    <span
      data-slot={layoutSlot(frame.variant, 'headChip')}
      className="order-2 inline-flex min-w-0"
    >
      <Chip {...props} />
    </span>
  )
}

LayoutHeadChip.displayName = 'Layout.Head.Chip'

const LayoutHeadCTAs = ({ children }: LayoutHeadCTAsProps) => {
  const frame = useContext(LayoutFrameContext)

  return (
    <div
      data-slot={layoutSlot(frame.variant, 'headCTAs')}
      className="order-3 ms-auto flex flex-wrap items-center gap-2"
    >
      {children}
    </div>
  )
}

LayoutHeadCTAs.displayName = 'Layout.Head.CTAs'

const LayoutHeadCTA = (props: CTAPlacedProps) => {
  const frame = useContext(LayoutFrameContext)

  return (
    <CTA
      data-slot={layoutSlot(frame.variant, 'headCTA')}
      variant="secondary"
      size="sm"
      {...props}
    />
  )
}

LayoutHeadCTA.displayName = 'Layout.Head.CTA'

const LayoutHeadTabs = ({ children }: LayoutHeadTabsProps) => {
  const frame = useContext(LayoutFrameContext)

  return (
    <div
      data-slot={layoutSlot(frame.variant, 'headTabs')}
      className="order-5 basis-full"
    >
      {children}
    </div>
  )
}

LayoutHeadTabs.displayName = 'Layout.Head.Tabs'

const LayoutContent = ({ children }: LayoutContentProps) => {
  const frame = useContext(LayoutFrameContext)

  return (
    <div
      data-slot={layoutSlot(frame.variant, 'content')}
      className={cn(
        'relative min-w-0',
        ({
          card: '',
          modal: 'min-h-0 flex-1 overflow-y-auto',
          page: 'flex-1',
        } satisfies Record<LayoutVariant, string>)[frame.variant],
        ({
          none: '',
          sm: 'p-3',
          md: 'p-inset',
          lg: 'p-gutter',
        } satisfies Record<LayoutInset, string>)[frame.inset],
      )}
    >
      {frame.loading === true && <LoadingBar />}
      {children}
    </div>
  )
}

LayoutContent.displayName = 'Layout.Content'

const LayoutFootCTA = ({ lane, variant, ...rest }: LayoutFootCTAProps) => {
  const frame = useContext(LayoutFrameContext)

  return (
    <CTABar.CTA
      lane={lane}
      variant={variant ?? footCTAVariant(frame.variant, lane)}
      size={footCTASize(frame.variant)}
      {...rest}
    />
  )
}

LayoutFootCTA.displayName = 'Layout.Foot.CTA'

const LayoutFootRoot = ({ children }: LayoutFootProps) => {
  const frame = useContext(LayoutFrameContext)

  return (
    <div
      data-slot={layoutSlot(frame.variant, 'foot')}
      className={cn(
        ({
          card: '',
          modal: 'shrink-0 border-t border-stress-outline',
          page: 'sticky bottom-0 border-t border-stress-outline bg-base',
        } satisfies Record<LayoutVariant, string>)[frame.variant],
        ({
          none: 'pt-3',
          sm: 'px-3 pb-3',
          md: 'px-inset pb-inset',
          lg: 'px-gutter py-3',
        } satisfies Record<LayoutInset, string>)[frame.inset],
      )}
    >
      <CTABar>
        {Children.map(children, (child) => (isValidElement<LayoutFootCTAProps>(child) && child.type === LayoutFootCTA
          ? (
            <CTABar.CTA
              {...child.props}
              variant={child.props.variant ?? footCTAVariant(frame.variant, child.props.lane)}
              size={footCTASize(frame.variant)}
            />
          )
          : child))}
      </CTABar>
    </div>
  )
}

LayoutFootRoot.displayName = 'Layout.Foot'

const LayoutHead = Object.assign(LayoutHeadRoot, {
  Title: LayoutHeadTitle,
  Subtitle: LayoutHeadSubtitle,
  Chip: LayoutHeadChip,
  CTAs: LayoutHeadCTAs,
  CTA: LayoutHeadCTA,
  Tabs: LayoutHeadTabs,
  Status: LayoutHeadStatus,
})

const LayoutFoot = Object.assign(LayoutFootRoot, {
  CTA: LayoutFootCTA,
})

export { LayoutContent, LayoutFoot, LayoutHead }
export type { LayoutContentProps, LayoutHeadStatusProps, LayoutFootCTAProps, LayoutFootProps, LayoutHeadCTAsProps, LayoutHeadProps, LayoutHeadSubtitleProps, LayoutHeadTabsProps, LayoutHeadTitleProps }
