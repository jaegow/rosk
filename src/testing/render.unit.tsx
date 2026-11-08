import { render } from '@testing-library/react'
import type { ReactNode } from 'react'

import { createTestHarness, type RenderWithProvidersOptions } from './testHarness'
import { TestProviders } from './TestProviders'

const renderWithProviders = (ui: ReactNode, options: RenderWithProvidersOptions = {}) => {
  const harness = createTestHarness(ui, options)
  return { ...render(<TestProviders harness={harness} />), ...harness }
}

export { renderWithProviders }
