import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createMemoryRouter, type DataRouter } from 'react-router'

import { createTestQueryClient } from '@/feature/app/App.queryClient'

type RenderWithProvidersOptions = {
  route?: string
  path?: string
  queryClient?: QueryClient
}

type TestHarness = {
  queryClient: QueryClient
  router: DataRouter
}

const createTestHarness = (ui: ReactNode, options: RenderWithProvidersOptions): TestHarness => ({
  queryClient: options.queryClient ?? createTestQueryClient(),
  router: createMemoryRouter([{ path: options.path ?? '*', element: ui }], { initialEntries: [options.route ?? '/'] }),
})

export { createTestHarness }
export type { RenderWithProvidersOptions, TestHarness }
