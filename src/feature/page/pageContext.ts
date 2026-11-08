import { createStableContext } from '@/feature/context/createStableContext'

import type { PageGateState } from './page.type'

type PageGate = {
  state: PageGateState
  retry?: () => unknown
}

const PageGateContext = createStableContext<PageGate>(import.meta.hot, 'PageGateContext', { state: 'ready' })

const PageNestedContext = createStableContext(import.meta.hot, 'PageNestedContext', false)

export { PageGateContext, PageNestedContext }
export type { PageGate }
