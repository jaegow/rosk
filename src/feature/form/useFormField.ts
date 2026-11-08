import { useId } from 'react'
import { useController } from 'react-hook-form'

import { useEnclosingForm } from './useEnclosingForm'

const useFormField = (name: string, helper: string | undefined) => {
  const form = useEnclosingForm()
  const controller = useController({ name, control: form.control })
  const id = useId()

  const required = form.requiredNames.has(name)
  const invalid = controller.fieldState.error !== undefined
  const ids = { control: `${id}control`, label: `${id}label`, message: `${id}message` }

  return {
    form,
    name,
    controller,
    required,
    invalid,
    ids,
    aria: {
      'aria-invalid': invalid || undefined,
      'aria-required': required || undefined,
      'aria-describedby': invalid || helper !== undefined ? ids.message : undefined,
    },
  }
}

type FormFieldState = ReturnType<typeof useFormField>

export { useFormField }
export type { FormFieldState }
