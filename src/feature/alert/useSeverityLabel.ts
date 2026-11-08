import { useCopy } from '@/feature/copy/useCopy'

import type { Severity } from './alert.type'

const useSeverityLabel = (): Record<Severity, string> => {
  const { t } = useCopy()
  return {
    info: t('common.severity.info'),
    success: t('common.severity.success'),
    warning: t('common.severity.warning'),
    danger: t('common.severity.danger'),
  }
}

export { useSeverityLabel }
