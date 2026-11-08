import type { FieldPath, FieldValues } from 'react-hook-form'

import { useCopy } from '@/feature/copy/useCopy'
import type { FormStore } from '@/feature/form/form.type'
import { serverFieldErrorOutcome } from '@/feature/form/form.util'
import { useToast } from '@/feature/toast/useToast'

import { serviceErrorFields, serviceErrorOutcome } from './serviceError'

type ServiceErrorForm<TModel extends FieldValues, TOutput> = Pick<FormStore<TModel, TOutput>, 'unsubmit' | 'setError' | 'getValues'>

const useServiceError = () => {
  const { t } = useCopy()
  const toast = useToast()

  return {
    handle: <TModel extends FieldValues, TOutput>(error: unknown, form?: ServiceErrorForm<TModel, TOutput>) => {
      const fields = form === undefined
        ? []
        : Object.entries(serviceErrorFields(error)).filter(([name]) => Object.hasOwn(form.getValues(), name))
      form?.unsubmit()
      if (form !== undefined && fields.length > 0) {
        fields.forEach(([name, code]) => form.setError(name as FieldPath<TModel>, { type: 'server', message: serverFieldErrorOutcome(code) }))
        return
      }
      const outcome = serviceErrorOutcome(error)
      toast.show({
        severity: 'danger',
        ...((): { title: string, description: string } => {
          switch (outcome) {
            case 'offline': return { title: t('common.serviceError.offline.title'), description: t('common.serviceError.offline.description') }
            case 'denied': return { title: t('common.serviceError.denied.title'), description: t('common.serviceError.denied.description') }
            case 'notFound': return { title: t('common.serviceError.notFound.title'), description: t('common.serviceError.notFound.description') }
            case 'refused': return { title: t('common.serviceError.refused.title'), description: t('common.serviceError.refused.description') }
            case 'failed': return { title: t('common.serviceError.failed.title'), description: t('common.serviceError.failed.description') }
          }
        })(),
      })
    },
  }
}

export { useServiceError }
