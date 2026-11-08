import { useContext } from 'react'

import type { FormStore } from './form.type'
import { FormStoreContext } from './formContext'

const useEnclosingForm = (): FormStore => {
  const form = useContext(FormStoreContext)
  if (form === null) throw new Error('A form part rendered outside a Form.')
  return form
}

export { useEnclosingForm }
