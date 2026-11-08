type PageAccess = 'resolving' | 'allowed' | 'denied'

type PageRead = {
  status: 'pending' | 'error' | 'success'
  error?: unknown
  refetch?: () => unknown
}

type PageGateState = 'resolving' | 'denied' | 'failed' | 'loading' | 'empty' | 'ready'

type PageContentLayout = 'flow' | 'fill' | '2-up'

export type { PageAccess, PageContentLayout, PageGateState, PageRead }
