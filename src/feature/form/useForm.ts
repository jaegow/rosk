import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useRef } from 'react'
import { type DefaultValues, type FieldValues, type Resolver, useForm as useLibraryForm } from 'react-hook-form'
import type * as z from 'zod'

import { useCopy } from '@/feature/copy/useCopy'
import { useToast } from '@/feature/toast/useToast'

import type { FormKind, FormStore, FormSubmitOutcome, RebaseOptions } from './form.type'
import { requiredFieldNames } from './form.util'
import { FormField, type TypedFormField } from './formFieldSet'
import { useDirtyUnderUpdate } from './useDirtyUnderUpdate'

type FormSchema = z.ZodType<FieldValues, FieldValues>

type FormInstance<TModel extends FieldValues, TOutput> = FormStore<TModel, TOutput> & {
  Field: TypedFormField<TModel>
}

type UseFormOptions<TSchema extends FormSchema> = {
  schema: TSchema
  defaultValues: DefaultValues<z.input<TSchema>>
  onSubmit: (values: z.output<TSchema>, form: FormStore<z.input<TSchema>, z.output<TSchema>>) => void | Promise<void>
  kind?: FormKind
}

const KEEP_EDITS = {
  keepDirtyValues: true,
  keepErrors: true,
  keepTouched: true,
  keepIsSubmitted: true,
  keepSubmitCount: true,
} as const

const useForm = <TSchema extends FormSchema>(options: UseFormOptions<TSchema>): FormInstance<z.input<TSchema>, z.output<TSchema>> => {
  const { t } = useCopy()
  const toast = useToast()
  const unchangedToastId = useId()
  const kind = options.kind ?? 'edit'
  const library = useLibraryForm<z.input<TSchema>, unknown, z.output<TSchema>>({
    resolver: zodResolver(options.schema) as unknown as Resolver<z.input<TSchema>, unknown, z.output<TSchema>>,
    defaultValues: options.defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  })
  const dirty = library.formState.isDirty || Object.keys(library.formState.dirtyFields).length > 0
  const baseline = library.formState.defaultValues
  const commit = useRef({ depth: 0 })

  const rebaseOnto = (values: DefaultValues<z.input<TSchema>> | z.input<TSchema>, rebaseOptions?: RebaseOptions) => {
    library.reset(values, rebaseOptions?.keepEdits === true ? KEEP_EDITS : undefined)
  }

  const form: FormInstance<z.input<TSchema>, z.output<TSchema>> = {
    control: library.control,
    register: library.register,
    watch: library.watch,
    subscribe: library.subscribe,
    getValues: library.getValues,
    getFieldState: library.getFieldState,
    getErrors: library.getErrors,
    setValues: library.setValues,
    setError: library.setError,
    clearErrors: library.clearErrors,
    setValue: library.setValue,
    trigger: library.trigger,
    formState: library.formState,
    unregister: library.unregister,
    setFocus: library.setFocus,
    kind,
    requiredNames: new Set(requiredFieldNames(options.schema)),
    submit: async (): Promise<FormSubmitOutcome> => {
      if (kind === 'edit' && !library.formState.isDirty) {
        toast.show({
          id: unchangedToastId,
          severity: 'info',
          title: t('common.form.unchanged.title'),
          description: t('common.form.unchanged.description'),
        })
        return 'unchanged'
      }
      const outcome = { submitted: false }
      await library.handleSubmit(async (values) => {
        outcome.submitted = true
        commit.current.depth += 1
        try {
          await options.onSubmit(values, form)
        } finally {
          commit.current.depth -= 1
        }
      })()
      return outcome.submitted ? 'submitted' : 'invalid'
    },
    revert: (names) => {
      if (names === undefined) {
        library.reset()
        return
      }
      names.forEach((name) => library.resetField(name))
    },
    rebase: rebaseOnto,
    unsubmit: () => library.reset(undefined, {
      keepValues: true,
      keepDefaultValues: true,
      keepDirty: true,
      keepErrors: true,
      keepTouched: true,
    }),
    commitOpen: () => {
      commit.current.depth += 1
    },
    commitClose: () => {
      commit.current.depth = Math.max(0, commit.current.depth - 1)
    },
    Field: FormField as TypedFormField<z.input<TSchema>>,
  }

  useDirtyUnderUpdate({
    record: options.defaultValues,
    baseline,
    tracked: kind === 'edit',
    dirty,
    committing: () => commit.current.depth > 0,
    rebase: rebaseOnto,
  })

  return form
}

export { useForm }
export type { FormInstance, FormSchema, UseFormOptions }
