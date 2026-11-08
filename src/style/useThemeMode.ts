import { useSyncExternalStore } from 'react'

type ThemeMode = 'light' | 'dark' | 'system'

const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system']

const THEME_MODE_STORAGE_KEY = 'rosk.themeMode'

const listeners = new Set<() => void>()

const isThemeMode = (value: unknown): value is ThemeMode => THEME_MODES.some((mode) => mode === value)

const readThemeMode = (): ThemeMode => {
  const stored = window.localStorage.getItem(THEME_MODE_STORAGE_KEY)
  return isThemeMode(stored) ? stored : 'system'
}

const writeThemeMode = (mode: ThemeMode): void => {
  window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode)
  listeners.forEach((listener) => listener())
}

const subscribeThemeMode = (listener: () => void) => {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

const applyThemeMode = (mode: ThemeMode, root: HTMLElement = document.documentElement): void => {
  if (mode === 'system') delete root.dataset.theme
  else root.dataset.theme = mode
}

const useThemeMode = () => {
  const mode = useSyncExternalStore(subscribeThemeMode, readThemeMode, (): ThemeMode => 'system')
  return { mode, setMode: writeThemeMode }
}

export { applyThemeMode, isThemeMode, THEME_MODE_STORAGE_KEY, THEME_MODES, useThemeMode }
export type { ThemeMode }
