import { QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { RouterProvider } from 'react-router/dom'

import { i18n } from '@/feature/i18n/i18n.config'

import type { TestHarness } from './testHarness'

const TestProviders = ({ harness }: { harness: TestHarness }) => (
  <QueryClientProvider client={harness.queryClient}>
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={harness.router} />
    </I18nextProvider>
  </QueryClientProvider>
)

TestProviders.displayName = 'TestProviders'

export { TestProviders }
