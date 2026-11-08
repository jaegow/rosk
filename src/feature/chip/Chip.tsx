import { useCopy } from '@/feature/copy/useCopy'
import { CountBadge } from '@/feature/count-badge/CountBadge'
import { CTA } from '@/feature/cta/CTA'
import { cn } from '@/style/cn'

import { CHIP_SLOT } from './chipSlot'

type ChipStatus = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

type ChipProps = {
  label: string
  status?: ChipStatus
  count?: number
  onRemove?: () => void
}

const Chip = ({ label, status = 'neutral', count, onRemove }: ChipProps) => {
  const { t } = useCopy()

  return (
    <span
      data-slot={CHIP_SLOT.root}
      data-chip-status={status}
      className={cn(
        'inline-flex h-6 max-w-full min-w-0 items-center gap-1 rounded-sm ps-2 text-caption whitespace-nowrap',
        onRemove === undefined ? 'pe-2' : 'pe-0',
        ({
          neutral: 'bg-base stress-sm text-stress',
          info: 'bg-info stress-xl-inverse text-stress',
          success: 'bg-success stress-xl-inverse text-stress',
          warning: 'bg-warning stress-xl-inverse text-stress',
          danger: 'bg-danger stress-xl-inverse text-stress',
        } satisfies Record<ChipStatus, string>)[status],
      )}
    >
      <span
        data-slot={CHIP_SLOT.label}
        className="min-w-0 truncate"
      >
        {label}
      </span>
      {count !== undefined && <CountBadge count={count} />}
      {onRemove !== undefined && (
        <CTA
          data-slot={CHIP_SLOT.removeCTA}
          variant="tertiary"
          size="sm"
          iconOnly="close"
          aria-label={t('common.chip.remove', { label })}
          onClick={() => onRemove()}
        />
      )}
    </span>
  )
}

Chip.displayName = 'Chip'

export { Chip }
export type { ChipProps, ChipStatus }
