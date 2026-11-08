import type { ReactNode } from 'react'
import { render } from 'vitest-browser-react'

import { createTestHarness, type RenderWithProvidersOptions } from './testHarness'
import { TestProviders } from './TestProviders'

const renderWithProviders = async (ui: ReactNode, options: RenderWithProvidersOptions = {}) => {
  const harness = createTestHarness(ui, options)
  const screen = await render(<TestProviders harness={harness} />)
  return Object.assign(screen, harness)
}

export { renderWithProviders }
