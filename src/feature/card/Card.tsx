import { Slot } from 'radix-ui'
import { type ReactNode, useContext, useId } from 'react'

import { CTA } from '@/feature/cta/CTA'
import type { CTAPlacedProps, CTAVariant, DistributiveOmit } from '@/feature/cta/cta.type'
import { LayoutContent, LayoutFoot, type LayoutFootCTAProps, type LayoutFootProps, LayoutHead, type LayoutHeadProps } from '@/feature/layout/Layout'
import type { HeadingLevel } from '@/feature/layout/layout.type'
import { nextHeadingLevel } from '@/feature/layout/layout.util'
import { HeadingLevelContext, LayoutFrameContext } from '@/feature/layout/layoutContext'
import { SideIndicator, type SideIndicatorVariant } from '@/feature/side-indicator/SideIndicator'
import { SideIndicatorEnclosedContext } from '@/feature/side-indicator/sideIndicatorContext'
import { cn } from '@/style/cn'

import { CARD_SLOT } from './cardSlot'

type CardVariant = 'outlined' | 'raised' | 'bare'

type CardDensity = 'sm' | 'md'

type CardProps = {
  variant?: CardVariant
  density?: CardDensity
  loading?: boolean
  indicator?: SideIndicatorVariant
  asChild?: boolean
  children: ReactNode
}

type CardContentProps = {
  children: ReactNode
}

type CardContentListProps = {
  children: ReactNode
}

type CardContentListItemProps = {
  label: string
  children?: ReactNode
}

type CardSectionProps = {
  title: string
  children: ReactNode
}

type CardFootCTAProps = DistributiveOmit<LayoutFootCTAProps, 'variant'> & {
  variant?: Exclude<CTAVariant, 'primary'>
}

const CardRoot = ({ variant = 'outlined', density = 'md', loading = false, indicator, asChild = false, children }: CardProps) => {
  const level = useContext(HeadingLevelContext)
  const enclosed = useContext(SideIndicatorEnclosedContext)
  const titleId = useId()
  const Comp = asChild ? Slot.Root : 'section'

  return (
    <LayoutFrameContext.Provider value={{ variant: 'card', inset: variant === 'bare' ? 'none' : density, titleLevel: level, titleId, loading }}>
      <HeadingLevelContext.Provider value={nextHeadingLevel(level)}>
        <SideIndicatorEnclosedContext.Provider value={enclosed || indicator !== undefined}>
          <Comp
            data-slot={CARD_SLOT.root}
            data-card-variant={variant}
            aria-labelledby={titleId}
            aria-busy={loading || undefined}
            className={cn('relative flex min-w-0 flex-col overflow-clip text-stress', ({
              outlined: 'rounded-lg border border-stress-outline bg-base',
              raised: 'rounded-lg bg-base shadow-md',
              bare: '',
            } satisfies Record<CardVariant, string>)[variant])}
          >
            <SideIndicatorEnclosedContext.Provider value={enclosed}>
              {indicator !== undefined && <SideIndicator variant={indicator} />}
            </SideIndicatorEnclosedContext.Provider>
            <Slot.Slottable>{children}</Slot.Slottable>
          </Comp>
        </SideIndicatorEnclosedContext.Provider>
      </HeadingLevelContext.Provider>
    </LayoutFrameContext.Provider>
  )
}

CardRoot.displayName = 'Card'

const CardHeadRoot = (props: LayoutHeadProps) => <LayoutHead {...props} />

CardHeadRoot.displayName = 'Card.Head'

const CardContentRoot = (props: CardContentProps) => <LayoutContent {...props} />

CardContentRoot.displayName = 'Card.Content'

const CardContentListRoot = ({ children }: CardContentListProps) => (
  <ul
    data-slot={CARD_SLOT.list}
    className="flex flex-col divide-y divide-stress-outline"
  >
    {children}
  </ul>
)

CardContentListRoot.displayName = 'Card.Content.List'

const CardContentListItem = ({ label, children }: CardContentListItemProps) => (
  <li
    data-slot={CARD_SLOT.listItem}
    className="flex items-baseline justify-between gap-3 py-2 text-body2"
  >
    <span
      data-slot={CARD_SLOT.listItemLabel}
      className="shrink-0 text-stress-xxl"
    >
      {label}
    </span>
    <span
      data-slot={CARD_SLOT.listItemValue}
      className="min-w-0 text-end break-words text-stress"
    >
      {children ?? '—'}
    </span>
  </li>
)

CardContentListItem.displayName = 'Card.Content.List.Item'

const CardContentListCTA = (props: CTAPlacedProps) => (
  <li
    data-slot={CARD_SLOT.listCTA}
    className="py-2"
  >
    <CTA
      variant="tertiary"
      size="sm"
      {...props}
    />
  </li>
)

CardContentListCTA.displayName = 'Card.Content.List.CTA'

const CardSection = ({ title, children }: CardSectionProps) => {
  const level = useContext(HeadingLevelContext)
  const titleId = useId()
  const Heading = ({ 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const satisfies Record<HeadingLevel, string>)[level]

  return (
    <section
      data-slot={CARD_SLOT.section}
      aria-labelledby={titleId}
      className="flex flex-col gap-2 border-t border-stress-outline pt-3 first:border-t-0 first:pt-0 [&+&]:mt-3"
    >
      <Heading
        id={titleId}
        data-slot={CARD_SLOT.sectionTitle}
        className="text-subtitle2 text-stress"
      >
        {title}
      </Heading>
      <HeadingLevelContext.Provider value={nextHeadingLevel(level)}>
        {children}
      </HeadingLevelContext.Provider>
    </section>
  )
}

CardSection.displayName = 'Card.Section'

const CardFootRoot = (props: LayoutFootProps) => <LayoutFoot {...props} />

CardFootRoot.displayName = 'Card.Foot'

const CardFootCTA: (props: CardFootCTAProps) => ReactNode = LayoutFoot.CTA

const CardHead = Object.assign(CardHeadRoot, {
  Title: LayoutHead.Title,
  Subtitle: LayoutHead.Subtitle,
  Chip: LayoutHead.Chip,
  CTAs: LayoutHead.CTAs,
  CTA: LayoutHead.CTA,
  Tabs: LayoutHead.Tabs,
  Status: LayoutHead.Status,
})

const CardContentList = Object.assign(CardContentListRoot, {
  Item: CardContentListItem,
  CTA: CardContentListCTA,
})

const CardContent = Object.assign(CardContentRoot, {
  List: CardContentList,
})

const CardFoot = Object.assign(CardFootRoot, {
  CTA: CardFootCTA,
})

const Card = Object.assign(CardRoot, {
  Head: CardHead,
  Content: CardContent,
  Section: CardSection,
  Foot: CardFoot,
})

export { Card }
export type { CardContentListItemProps, CardContentListProps, CardContentProps, CardDensity, CardFootCTAProps, CardProps, CardSectionProps, CardVariant }
