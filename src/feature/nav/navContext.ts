import { createStableContext } from '@/feature/context/createStableContext'

import type { NavVariant } from './nav.type'

const NavVariantContext = createStableContext<NavVariant>(import.meta.hot, 'NavVariantContext', 'side')

export { NavVariantContext }
