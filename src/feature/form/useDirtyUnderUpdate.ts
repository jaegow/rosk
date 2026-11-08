import { useEffect, useEffectEvent, useId } from 'react'

import { useCopy } from '@/feature/copy/useCopy'
import { useToast } from '@/feature/toast/useToast'

import type { RebaseOptions } from './form.type'
import { isDeepEqual } from './form.util'

type DirtyUnderUpdateOptions<TModel> = {
  record: TModel
  baseline: unknown
  tracked: boolean
  dirty: boolean
  committing: () => boolean
  rebase: (values: TModel, options?: RebaseOptions) => void
}

const useDirtyUnderUpdate = <TModel>(options: DirtyUnderUpdateOptions<TModel>) => {
  const { t } = useCopy()
  const toast = useToast()
  const toastId = useId()
  const recordKey = JSON.stringify(options.record)
  const moved = options.tracked && !isDeepEqual(options.record, options.baseline)

  const onRecordChecked = useEffectEvent(() => {
    if (!moved) {
      toast.dismiss(toastId)
      return
    }
    if (options.committing()) {
      options.rebase(options.record, { keepEdits: true })
      return
    }
    if (!options.dirty) {
      options.rebase(options.record)
      return
    }
    toast.show({
      id: toastId,
      severity: 'warning',
      title: t('common.form.updatedElsewhere.title'),
      description: t('common.form.updatedElsewhere.description'),
      cta: { label: t('common.form.loadLatest'), onPress: () => options.rebase(options.record) },
    })
  })

  useEffect(() => {
    onRecordChecked()
  }, [moved, recordKey, options.dirty])
}

export { useDirtyUnderUpdate }
