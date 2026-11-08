import { createStableContext } from '@/feature/context/createStableContext'

type LeaveGuardSource = {
  dirty: boolean
}

type LeaveGuard = {
  register: (source: LeaveGuardSource) => () => void
  confirmDiscard: (discard: () => void) => void
}

const LeaveGuardContext = createStableContext<LeaveGuard | null>(import.meta.hot, 'LeaveGuardContext', null)

export { LeaveGuardContext }
export type { LeaveGuard, LeaveGuardSource }
