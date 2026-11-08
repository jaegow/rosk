import { fileURLToPath } from 'node:url'

import { transformAsync } from '@babel/core'
import { reactCompilerPreset } from '@vitejs/plugin-react'
import { createServer } from 'vite'
import { describe, expect, it } from 'vitest'

const ROOT = fileURLToPath(new URL('../../../', import.meta.url))

const COMPONENT = `
export const Greeting = ({ name }) => {
  const label = 'Hello ' + name
  return <p title={label}>{label}</p>
}
`

const MEMO_CACHE = /react\/compiler-runtime|\b_c\(/

describe('React Compiler', () => {
  it('memoizes a component compiled through the preset the Vite config uses', async () => {
    const output = await transformAsync(COMPONENT, {
      filename: 'Greeting.jsx',
      babelrc: false,
      configFile: false,
      parserOpts: { plugins: ['jsx'] },
      presets: [reactCompilerPreset().preset],
    })

    expect(output?.code).toMatch(MEMO_CACHE)
  })

  it('leaves a module with no component or hook untouched', async () => {
    const output = await transformAsync('export const sum = (a, b) => a + b', {
      filename: 'sum.js',
      babelrc: false,
      configFile: false,
      presets: [reactCompilerPreset().preset],
    })

    expect(output?.code).not.toMatch(MEMO_CACHE)
  })

  it('runs in the app pipeline: the dev server serves a page with a memo cache', async () => {
    const server = await createServer({
      root: ROOT,
      configFile: `${ROOT}vite.config.ts`,
      logLevel: 'silent',
      server: { middlewareMode: true, hmr: false, ws: false },
    })
    try {
      const result = await server.environments.client.transformRequest('/src/feature/app/NotFound.tsx')
      expect(result?.code).toMatch(MEMO_CACHE)
    } finally {
      await server.close()
    }
  }, 30_000)
})
