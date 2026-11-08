import { type Context, createElement, useContext } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { createStableContext } from './createStableContext'

const fakeHot = () => {
  const data: Record<string, unknown> = {}
  return { hot: { data } as unknown as ImportMeta['hot'], data }
}

const readWithoutProvider = (context: Context<string>) => {
  const Reader = () => useContext(context)
  return renderToStaticMarkup(createElement(Reader))
}

describe('createStableContext', () => {
  it('returns the stored context on every hot re-run of its module', () => {
    const module = fakeHot()

    const first = createStableContext(module.hot, 'ExampleContext', 'first default')
    const rerun = createStableContext(module.hot, 'ExampleContext', 'edited default')

    expect(rerun).toBe(first)
    expect(module.data.ExampleContext).toBe(first)
    expect(first.displayName).toBe('ExampleContext')
    expect(readWithoutProvider(rerun)).toBe('first default')
  })

  it('keeps contexts of different names apart', () => {
    const module = fakeHot()

    const example = createStableContext(module.hot, 'ExampleContext', 'a')
    const other = createStableContext(module.hot, 'OtherContext', 'b')

    expect(other).not.toBe(example)
    expect(module.data.OtherContext).toBe(other)
  })

  it('mints a new context after a full reload', () => {
    const first = createStableContext(fakeHot().hot, 'ExampleContext', 'a')
    const afterReload = createStableContext(fakeHot().hot, 'ExampleContext', 'a')
    expect(afterReload).not.toBe(first)
  })

  it.each([
    ['no hot runtime', undefined],
    ['a hot runtime without data', { accept: () => undefined } as unknown as ImportMeta['hot']],
  ])('is a plain createContext with %s', (_label, hot) => {
    const first = createStableContext(hot, 'ExampleContext', 'default value')
    const second = createStableContext(hot, 'ExampleContext', 'default value')

    expect(second).not.toBe(first)
    expect(first.displayName).toBe('ExampleContext')
    expect(readWithoutProvider(first)).toBe('default value')
  })
})
