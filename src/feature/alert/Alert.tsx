import type { ReactNode } from 'react'

import { CTA } from '@/feature/cta/CTA'
import type { CTAPlacedProps } from '@/feature/cta/cta.type'
import { cn } from '@/style/cn'

import type { Severity } from './alert.type'
import { ALERT_SLOT } from './alertSlot'
import { SeverityIcon } from './SeverityIcon'

type AlertMessage =
  | { title: string, message?: ReactNode }
  | { title?: string, message: ReactNode }

type AlertProps = AlertMessage & {
  severity?: Severity
  children?: ReactNode
}

const AlertRoot = ({ severity = 'info', title, message, children }: AlertProps) => (
  <div
    data-slot={ALERT_SLOT.root}
    data-severity={severity}
    className={cn('flex items-start gap-3 px-inset py-3 text-body2', ({
      info: 'bg-info stress-xl-inverse text-stress',
      success: 'bg-success stress-xl-inverse text-stress',
      warning: 'bg-warning stress-xl-inverse text-stress',
      danger: 'bg-danger stress-xl-inverse text-stress',
    } satisfies Record<Severity, string>)[severity])}
  >
    <SeverityIcon severity={severity} />
    <div
      data-slot={ALERT_SLOT.content}
      className="flex min-w-0 flex-1 flex-col gap-1"
    >
      {title !== undefined && (
        <p
          data-slot={ALERT_SLOT.title}
          className="text-subtitle2"
        >
          {title}
        </p>
      )}
      {message !== undefined && (
        <div
          data-slot={ALERT_SLOT.message}
          className="line-clamp-2"
        >
          {message}
        </div>
      )}
    </div>
    {children !== undefined && (
      <div
        data-slot={ALERT_SLOT.ctas}
        className="flex shrink-0 flex-wrap items-center gap-2"
      >
        {children}
      </div>
    )}
  </div>
)

AlertRoot.displayName = 'Alert'

const AlertCTA = (props: CTAPlacedProps) => (
  <CTA
    data-slot={ALERT_SLOT.cta}
    variant="secondary"
    size="sm"
    {...props}
  />
)

AlertCTA.displayName = 'Alert.CTA'

const Alert = Object.assign(AlertRoot, {
  CTA: AlertCTA,
})

export { Alert }
export type { AlertMessage, AlertProps }
