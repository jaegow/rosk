import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

type FormKind = 'create' | 'edit'

type FormLayout = 'col-1' | 'col-2'

type FormSubmitOutcome = 'unchanged' | 'invalid' | 'submitted'

type RebaseOptions = {
  keepEdits?: boolean
}

type FormStore<TModel extends FieldValues = FieldValues, TOutput = TModel> = Omit<UseFormReturn<TModel, unknown, TOutput>, 'handleSubmit' | 'reset' | 'resetField' | 'resetDefaultValues'> & {
  kind: FormKind
  requiredNames: ReadonlySet<string>
  submit: () => Promise<FormSubmitOutcome>
  revert: (names?: readonly FieldPath<TModel>[]) => void
  rebase: (values: TModel, options?: RebaseOptions) => void
  unsubmit: () => void
  commitOpen: () => void
  commitClose: () => void
}

export type { FormKind, FormLayout, FormStore, FormSubmitOutcome, RebaseOptions }
