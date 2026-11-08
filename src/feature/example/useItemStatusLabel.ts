import { useCopy } from '@/feature/copy/useCopy'

import type { ItemStatus } from './item.type'

const useItemStatusLabel = (): Record<ItemStatus, string> => {
  const { t } = useCopy()
  return {
    draft: t('common.items.status.draft'),
    active: t('common.items.status.active'),
    paused: t('common.items.status.paused'),
    archived: t('common.items.status.archived'),
  }
}

export { useItemStatusLabel }
