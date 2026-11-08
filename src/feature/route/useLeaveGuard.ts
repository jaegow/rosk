import { useContext, useEffect } from 'react'
import { type FieldValues, useFormState } from 'react-hook-form'

import type { FormStore } from '@/feature/form/form.type'

import { LeaveGuardContext } from './leaveGuardContext'

type LeaveGuardForm<TModel extends FieldValues, TOutput> = Pick<FormStore<TModel, TOutput>, 'control' | 'subscribe'>

const isDirtyState = (state: { isDirty?: boolean, dirtyFields?: object }) => state.isDirty === true || Object.keys(state.dirtyFields ?? {}).length > 0

const useLeaveGuard = <TModel extends FieldValues, TOutput>(form: LeaveGuardForm<TModel, TOutput>) => {
  const guard = useContext(LeaveGuardContext)
  const formState = useFormState({ control: form.control })
  const dirty = isDirtyState(formState)
  const subscribe = form.subscribe

  useEffect(() => {
    if (guard === null) return
    const source = { dirty }
    const unregister = guard.register(source)
    const unsubscribe = subscribe({
      formState: { isDirty: true, dirtyFields: true },
      callback: (next) => {
        source.dirty = isDirtyState(next)
      },
    })
    return () => {
      unsubscribe()
      unregister()
    }
  }, [guard, dirty, subscribe])
}

export { useLeaveGuard }
export type { LeaveGuardForm }
