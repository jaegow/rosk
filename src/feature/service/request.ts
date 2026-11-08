import { parseServiceErrorBody, ServiceError } from './serviceError'

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: RequestMethod
  body?: unknown
  signal?: AbortSignal
}

const request = async <TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> => {
  const method = options.method ?? 'GET'
  const response = await fetch(`${import.meta.env.VITE_API_URL ?? ''}${path}`, {
    method,
    headers: options.body === undefined
      ? { Accept: 'application/json' }
      : { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  }).catch((error: unknown) => {
    if (options.signal?.aborted === true) throw error
    throw new ServiceError(0)
  })
  const text = await response.text()
  const json = ((): unknown => {
    if (text === '') return undefined
    try {
      return JSON.parse(text) as unknown
    } catch {
      return undefined
    }
  })()
  if (!response.ok) throw new ServiceError(response.status, parseServiceErrorBody(json))
  return json as TResponse
}

export { request }
export type { RequestMethod, RequestOptions }
