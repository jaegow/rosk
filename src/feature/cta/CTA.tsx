import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'

import { Icon, type IconSize } from '@/feature/icon/Icon'
import { Spinner } from '@/feature/spinner/Spinner'
import { Tooltip } from '@/feature/tooltip/Tooltip'
import { cn } from '@/style/cn'

import type { CTAProps, CTASize } from './cta.type'
import { CTA_SLOT } from './ctaSlot'

const CTA = (props: CTAProps) => {
  const {
    variant = 'secondary',
    size = 'md',
    unavailable = false,
    loading = false,
    iconOnly,
    icon,
    asChild = false,
    href,
    children,
    ...rest
  } = props
  const iconSize = ({ sm: 'sm', md: 'sm', lg: 'md' } satisfies Record<CTASize, IconSize>)[size]
  const Comp = asChild || href !== undefined ? Slot.Root : 'button'

  const control = (
    <Comp
      {...(Comp === 'button' ? { type: 'button' as const } : {})}
      data-slot={CTA_SLOT.root}
      aria-disabled={unavailable || undefined}
      aria-busy={loading || undefined}
      className={cn(
        'relative inline-flex min-w-0 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border whitespace-nowrap select-none focus-visible:focus-ring',
        'aria-busy:cursor-progress aria-busy:[&>:not([data-slot=cta-busy])]:opacity-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-60',
        ({
          primary: 'border-transparent bg-brand text-base hover:stress-hover active:stress-selected',
          secondary: 'border-stress-outline bg-base text-stress hover:stress-hover active:stress-selected',
          tertiary: 'border-transparent bg-transparent text-stress hover:stress-hover active:stress-selected',
          danger: 'border-danger bg-danger stress-xl-inverse text-stress hover:stress-lg-inverse active:stress-md-inverse',
        } satisfies Record<NonNullable<CTAProps['variant']>, string>)[variant],
        iconOnly === undefined
          ? ({
            sm: 'h-6 px-2 text-body3',
            md: 'h-8 px-3 text-subtitle2',
            lg: 'h-10 px-4 text-subtitle1',
          } satisfies Record<CTASize, string>)[size]
          : ({
            sm: 'size-6',
            md: 'size-8',
            lg: 'size-10',
          } satisfies Record<CTASize, string>)[size],
      )}
      {...(rest as ComponentProps<'button'>)}
      {...(loading ? { onClick: (event: { preventDefault: () => void }) => event.preventDefault() } : {})}
      data-cta-variant={variant}
    >
      {iconOnly !== undefined && (
        <Icon
          name={iconOnly}
          size={iconSize}
        />
      )}
      {icon?.start !== undefined && (
        <Icon
          name={icon.start}
          size={iconSize}
        />
      )}
      <Slot.Slottable child={href === undefined ? children : <a href={href}>{children}</a>}>
        {(label) => (iconOnly === undefined
          ? (
            <span
              data-slot={CTA_SLOT.label}
              className="min-w-0 truncate"
            >
              {label}
            </span>
          )
          : null)}
      </Slot.Slottable>
      {icon?.end !== undefined && (
        <Icon
          name={icon.end}
          size={iconSize}
        />
      )}
      {loading && (
        <span
          data-slot={CTA_SLOT.busy}
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <Spinner size="sm" />
        </span>
      )}
    </Comp>
  )

  return iconOnly === undefined
    ? control
    : <Tooltip label={props['aria-label']}>{control}</Tooltip>
}

CTA.displayName = 'CTA'

export { CTA }
