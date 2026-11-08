import { cn } from '@/style/cn'

import { ICON_PATHS, type IconName } from './icon.util'
import { ICON_SLOT } from './iconSlot'

type IconSize = 'sm' | 'md' | 'lg'

type IconProps = {
  name: IconName
  size?: IconSize
  label?: string
}

const Icon = ({ name, size = 'md', label }: IconProps) => (
  <svg
    data-slot={ICON_SLOT.root}
    data-icon={name}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('shrink-0', ({
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    } satisfies Record<IconSize, string>)[size])}
    {...(label === undefined ? { 'aria-hidden': true } : { 'role': 'img', 'aria-label': label })}
  >
    {ICON_PATHS[name].map((path) => (
      <path
        key={path}
        d={path}
      />
    ))}
  </svg>
)

Icon.displayName = 'Icon'

export { Icon }
export type { IconProps, IconSize }
