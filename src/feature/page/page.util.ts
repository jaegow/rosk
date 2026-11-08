import type { PageAccess, PageGateState, PageRead } from './page.type'

type PageGateInput = {
  access?: PageAccess
  read?: Pick<PageRead, 'status'>
  empty?: boolean
}

const pageGateState = ({ access = 'allowed', read, empty = false }: PageGateInput): PageGateState => {
  if (access === 'denied') return 'denied'
  if (access === 'resolving') return 'resolving'
  if (read?.status === 'error') return 'failed'
  if (read?.status === 'pending') return 'loading'
  return empty ? 'empty' : 'ready'
}

const combineReads = (read: PageRead | readonly PageRead[] | undefined): PageRead | undefined => {
  const reads = read === undefined ? [] : [read].flat()
  const failed = reads.filter((each) => each.status === 'error')
  if (failed.length > 0) return { status: 'error', error: failed[0]?.error, refetch: () => failed.forEach((each) => each.refetch?.()) }
  if (reads.some((each) => each.status === 'pending')) return { status: 'pending' }
  return reads.length > 0 ? { status: 'success' } : undefined
}

const ownsChrome = (state: PageGateState): boolean => state !== 'resolving' && state !== 'denied'

export { combineReads, ownsChrome, pageGateState }
export type { PageGateInput }
