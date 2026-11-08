import { createStableContext } from '@/feature/context/createStableContext'

import type { FormLayout, FormStore } from './form.type'

const FormStoreContext = createStableContext<FormStore | null>(import.meta.hot, 'FormStoreContext', null)

const FormLayoutContext = createStableContext<FormLayout>(import.meta.hot, 'FormLayoutContext', 'col-1')

export { FormLayoutContext, FormStoreContext }
