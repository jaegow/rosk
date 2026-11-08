import '@/style/theme.css'

import type { QueryClient } from '@tanstack/react-query'

import { AppProvider } from './App.provider'
import { AppRouter } from './App.router'

type AppProps = {
  queryClient?: QueryClient
}

const App = ({ queryClient }: AppProps) => (
  <AppProvider queryClient={queryClient}>
    <AppRouter />
  </AppProvider>
)

App.displayName = 'App'

export { App }
export type { AppProps }
