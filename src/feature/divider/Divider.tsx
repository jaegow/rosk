import { cn } from '@/style/cn'

import { DIVIDER_SLOT } from './dividerSlot'

type DividerOrientation = 'horizontal' | 'vertical'

type DividerProps = {
  orientation?: DividerOrientation
  inset?: boolean
}

const Divider = ({ orientation = 'horizontal', inset = false }: DividerProps) => (
  <hr
    data-slot={DIVIDER_SLOT.root}
    aria-orientation={orientation}
    className={cn(
      'shrink-0 self-stretch border-0 bg-stress-outline',
      ({
        horizontal: 'h-px',
        vertical: 'h-auto w-px',
      } satisfies Record<DividerOrientation, string>)[orientation],
      inset && ({
        horizontal: 'mx-inset',
        vertical: 'my-inset',
      } satisfies Record<DividerOrientation, string>)[orientation],
    )}
  />
)

Divider.displayName = 'Divider'

export { Divider }
export type { DividerOrientation, DividerProps }
