import { useCopy } from '@/feature/copy/useCopy'
import { cn } from '@/style/cn'

import { SPINNER_SLOT } from './spinnerSlot'

type SpinnerSize = 'sm' | 'md' | 'lg'

type SpinnerProps = {
  size?: SpinnerSize
  label?: string
}

const Spinner = ({ size = 'md', label }: SpinnerProps) => {
  const { t } = useCopy()

  return (
    <output
      data-slot={SPINNER_SLOT.root}
      aria-label={label ?? t('common.loading')}
      className="inline-flex shrink-0"
    >
      <span
        data-slot={SPINNER_SLOT.ring}
        data-motion="essential"
        className={cn('animate-spinner rounded-full border-2 border-current border-t-transparent', ({
          sm: 'size-4',
          md: 'size-5',
          lg: 'size-8',
        } satisfies Record<SpinnerSize, string>)[size])}
      />
    </output>
  )
}

Spinner.displayName = 'Spinner'

export { Spinner }
export type { SpinnerProps, SpinnerSize }
