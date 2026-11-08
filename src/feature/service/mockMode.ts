type MockModeEnv = {
  MODE: string
  VITE_API_URL?: string
}

const isMockMode = (env: MockModeEnv): boolean => env.MODE === 'development' && (env.VITE_API_URL ?? '') === ''

export { isMockMode }
export type { MockModeEnv }
