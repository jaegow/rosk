import { createStableContext } from '@/feature/context/createStableContext'

import type { HeadingLevel, LayoutFrame } from './layout.type'

const LayoutFrameContext = createStableContext<LayoutFrame>(import.meta.hot, 'LayoutFrameContext', { variant: 'card', inset: 'md', titleLevel: 2 })

const HeadingLevelContext = createStableContext<HeadingLevel>(import.meta.hot, 'HeadingLevelContext', 2)

export { HeadingLevelContext, LayoutFrameContext }
