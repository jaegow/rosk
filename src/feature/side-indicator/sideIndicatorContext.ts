import { createStableContext } from '@/feature/context/createStableContext'

const SideIndicatorEnclosedContext = createStableContext(import.meta.hot, 'SideIndicatorEnclosedContext', false)

export { SideIndicatorEnclosedContext }
