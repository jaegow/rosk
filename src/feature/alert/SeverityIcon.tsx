import { Icon } from '@/feature/icon/Icon'
import type { IconName } from '@/feature/icon/icon.util'

import type { Severity } from './alert.type'
import { ALERT_SLOT } from './alertSlot'
import { useSeverityLabel } from './useSeverityLabel'

type SeverityIconProps = {
  severity: Severity
}

const SeverityIcon = ({ severity }: SeverityIconProps) => {
  const severityLabel = useSeverityLabel()

  return (
    <span
      data-slot={ALERT_SLOT.severityIcon}
      className="inline-flex shrink-0"
    >
      <Icon
        name={({
          info: 'info',
          success: 'success',
          warning: 'warning',
          danger: 'error',
        } satisfies Record<Severity, IconName>)[severity]}
        label={severityLabel[severity]}
      />
    </span>
  )
}

SeverityIcon.displayName = 'SeverityIcon'

export { SeverityIcon }
export type { SeverityIconProps }
