import type { PageRead } from '@/feature/page/page.type'

type QueryRead = {
  status: PageRead['status']
  data: unknown
  error: unknown
  refetch: () => unknown
}

const firstRead = (query: QueryRead): PageRead => {
  if (query.status === 'error' && query.data !== undefined) return { status: 'success', refetch: query.refetch }
  return { status: query.status, error: query.error, refetch: query.refetch }
}

export { firstRead }
export type { QueryRead }
