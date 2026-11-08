import { countBadgeText } from './countBadge.util'
import { COUNT_BADGE_SLOT } from './countBadgeSlot'

type CountBadgeProps = {
  count: number
}

const CountBadge = ({ count }: CountBadgeProps) => (
  <span
    data-slot={COUNT_BADGE_SLOT.root}
    className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-stress px-1.5 text-caption text-base tabular-nums"
  >
    {countBadgeText(count)}
  </span>
)

CountBadge.displayName = 'CountBadge'

export { CountBadge }
export type { CountBadgeProps }
