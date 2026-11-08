import { type Context, createContext } from 'react'

type HotData = Record<string, unknown>

const createStableContext = <T>(hot: ImportMeta['hot'], name: string, defaultValue: T): Context<T> => {
  const data: HotData | undefined = hot?.data
  const stored = data?.[name]
  if (stored !== undefined) return stored as Context<T>

  const context = createContext(defaultValue)
  context.displayName = name
  if (data !== undefined) data[name] = context
  return context
}

export { createStableContext }
