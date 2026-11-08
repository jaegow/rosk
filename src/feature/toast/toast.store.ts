import type { Severity } from '@/feature/alert/alert.type'

type ToastCTA = {
  label: string
  onPress: () => void
}

type ToastScope = 'component' | 'app' | 'required'

type ToastMessage = {
  id?: string
  severity: Severity
  title: string
  description?: string
}

type ToastInput =
  | ToastMessage & { scope?: 'component' | 'app', cta?: ToastCTA }
  | ToastMessage & { scope: 'required', cta: ToastCTA }

type ToastEntry = {
  id: string
  severity: Severity
  title: string
  description?: string
  cta?: ToastCTA
  scope: ToastScope
  duration: number | null
  revision: number
}

type ToastRaise = Pick<ToastEntry, 'id' | 'severity' | 'title' | 'description' | 'scope'>

type ToastSnapshot = {
  shown: ToastEntry[]
  queued: ToastEntry[]
}

const TOAST_SHOWN_LIMIT = 3

const TOAST_DURATION_MS = 5000

const RECORDS_RAISES = import.meta.env.MODE === 'test'

const listeners = new Set<() => void>()

const state = {
  entries: [] as ToastEntry[],
  raised: [] as ToastRaise[],
  sequence: 0,
  snapshot: { shown: [], queued: [] } as ToastSnapshot,
}

const commit = (entries: ToastEntry[]) => {
  state.entries = entries
  state.snapshot = { shown: entries.slice(0, TOAST_SHOWN_LIMIT), queued: entries.slice(TOAST_SHOWN_LIMIT) }
  listeners.forEach((listener) => listener())
}

const show = (input: ToastInput): string => {
  const existing = state.entries.find((entry) => (input.id === undefined
    ? entry.severity === input.severity && entry.title === input.title && entry.description === input.description
    : entry.id === input.id))
  const id = existing?.id ?? input.id ?? `toast-${state.sequence + 1}`
  const scope = input.scope ?? 'app'
  const entry: ToastEntry = {
    id,
    severity: input.severity,
    title: input.title,
    description: input.description,
    cta: input.cta,
    scope,
    duration: input.severity === 'danger' || scope === 'required' ? null : TOAST_DURATION_MS,
    revision: (existing?.revision ?? 0) + 1,
  }
  state.sequence += 1
  if (RECORDS_RAISES) state.raised.push({ id, severity: entry.severity, title: entry.title, description: entry.description, scope })
  commit(existing === undefined
    ? [...state.entries, entry]
    : state.entries.map((candidate) => (candidate.id === id ? entry : candidate)))
  return id
}

const dismiss = (id: string) => {
  if (!state.entries.some((entry) => entry.id === id)) return
  commit(state.entries.filter((entry) => entry.id !== id))
}

const subscribeToast = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getToastSnapshot = (): ToastSnapshot => state.snapshot

const getToastRaised = (): readonly ToastRaise[] => [...state.raised]

const resetToast = () => {
  state.sequence = 0
  state.raised = []
  commit([])
}

const toast = { show, dismiss }

export { getToastRaised, getToastSnapshot, resetToast, subscribeToast, toast, TOAST_DURATION_MS, TOAST_SHOWN_LIMIT }
export type { ToastCTA, ToastEntry, ToastInput, ToastRaise, ToastScope, ToastSnapshot }
