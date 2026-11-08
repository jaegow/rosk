import { fileURLToPath } from 'node:url'

import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defaultExclude, defineConfig } from 'vitest/config'

const fromRoot = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))

const JSDOM_UNIT_TESTS = ['src/**/*.test.unit.tsx', 'src/**/use*.test.unit.ts']

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: [{ find: /^@\//, replacement: `${fromRoot('./src')}/` }],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  test: {
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit-node',
          environment: 'node',
          include: ['src/**/*.test.unit.ts', 'scripts/**/*.test.unit.ts'],
          exclude: [...defaultExclude, ...JSDOM_UNIT_TESTS],
          setupFiles: [fromRoot('./src/testing/setup.unit.base.ts')],
        },
      },
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: JSDOM_UNIT_TESTS,
          setupFiles: [fromRoot('./src/testing/setup.unit.ts')],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['src/**/*.test.browser.tsx'],
          setupFiles: [fromRoot('./src/testing/setup.browser.ts')],
          testTimeout: 15000,
          expect: { poll: { timeout: 5000 } },
          browser: {
            enabled: true,
            headless: process.env.HEADLESS !== 'false',
            provider: playwright({ contextOptions: { reducedMotion: 'reduce' } }),
            viewport: { width: 1280, height: 800 },
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
