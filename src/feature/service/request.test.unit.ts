import { beforeEach, describe, expect, it, vi } from 'vitest'

import { request } from './request'
import { ServiceError } from './serviceError'

const respond = (status: number, body?: unknown) => vi.fn<typeof fetch>(() => Promise.resolve(new Response(body === undefined ? null : JSON.stringify(body), { status })))

describe('request', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
  })

  it('reads JSON from the base URL with a GET by default', async () => {
    const fetchSpy = respond(200, [{ id: '1' }])
    vi.stubGlobal('fetch', fetchSpy)

    await expect(request('/items')).resolves.toEqual([{ id: '1' }])
    expect(fetchSpy).toHaveBeenCalledWith('https://api.example.test/items', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: undefined,
      signal: undefined,
    })
  })

  it('sends a body as JSON with its content type', async () => {
    const fetchSpy = respond(201, { id: '2' })
    vi.stubGlobal('fetch', fetchSpy)

    await request('/items', { method: 'POST', body: { name: 'Example' } })
    expect(fetchSpy).toHaveBeenCalledWith('https://api.example.test/items', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: '{"name":"Example"}',
      signal: undefined,
    })
  })

  it('resolves an empty response as undefined', async () => {
    vi.stubGlobal('fetch', respond(204))

    await expect(request('/items/1', { method: 'DELETE' })).resolves.toBeUndefined()
  })

  it('rejects a refusal with a typed error carrying its status and parsed body', async () => {
    vi.stubGlobal('fetch', respond(422, { code: 'invalid', fields: { name: 'required' }, detail: 'ignored' }))

    const error = await request('/items').catch((caught: unknown) => caught)
    expect(error).toBeInstanceOf(ServiceError)
    expect(error).toMatchObject({ status: 422, body: { code: 'invalid', fields: { name: 'required' } } })
  })

  it('rejects an unreachable server as status 0', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>(() => Promise.reject(new TypeError('Failed to fetch'))))

    await expect(request('/items')).rejects.toMatchObject({ status: 0, body: {} })
  })

  it('passes an abort through untouched so the caller can tell it from a failure', async () => {
    const controller = new AbortController()
    controller.abort()
    const abort = new DOMException('aborted', 'AbortError')
    vi.stubGlobal('fetch', vi.fn<typeof fetch>(() => Promise.reject(abort)))

    await expect(request('/items', { signal: controller.signal })).rejects.toBe(abort)
  })
})
