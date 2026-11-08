import { createStableContext } from '@/feature/context/createStableContext'

import type { TabsVariant } from './tabs.type'

const TabsVariantContext = createStableContext<TabsVariant>(import.meta.hot, 'TabsVariantContext', 'line')

export { TabsVariantContext }
