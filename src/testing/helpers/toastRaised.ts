import { getToastRaised, type ToastRaise } from '@/feature/toast/toast.store'

type ToastMatch = Partial<Pick<ToastRaise, 'severity' | 'title' | 'scope'>>

const toastRaised = (match: ToastMatch = {}): ToastRaise[] => getToastRaised().filter((raise) =>
  (match.severity === undefined || raise.severity === match.severity)
  && (match.title === undefined || raise.title === match.title)
  && (match.scope === undefined || raise.scope === match.scope))

export { toastRaised }
export type { ToastMatch }
