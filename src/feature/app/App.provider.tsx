import { type QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

import { i18n } from '@/feature/i18n/i18n.config'
import { applyThemeMode, useThemeMode } from '@/style/useThemeMode'

import { createQueryClient } from './App.queryClient'

type AppProviderProps = {
  queryClient?: QueryClient
  children: ReactNode
}

const AppProvider = ({ queryClient: prop_queryClient, children }: AppProviderProps) => {
  const [queryClient] = useState(() => prop_queryClient ?? createQueryClient())
  const themeMode = useThemeMode()

  useEffect(() => {
    applyThemeMode(themeMode.mode)
  }, [themeMode.mode])

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </QueryClientProvider>
  )
}

AppProvider.displayName = 'AppProvider'

export { AppProvider }
export type { AppProviderProps }
