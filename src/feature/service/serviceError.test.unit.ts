import { describe, expect, it } from 'vitest'

import { parseServiceErrorBody, ServiceError, serviceErrorFields, serviceErrorOutcome } from './serviceError'

describe('parseServiceErrorBody', () => {
  it('keeps a string code and string field codes, and drops everything else', () => {
    expect(parseServiceErrorBody({ code: 'taken', fields: { name: 'taken', count: 3 }, detail: 'Server text' })).toEqual({ code: 'taken', fields: { name: 'taken' } })
  })

  it('reads a body that is not an object as empty', () => {
    expect(parseServiceErrorBody('Bad gateway')).toEqual({})
    expect(parseServiceErrorBody(undefined)).toEqual({})
    expect(parseServiceErrorBody({ fields: { count: 3 } })).toEqual({})
  })
})

describe('serviceErrorOutcome', () => {
  it('names the outcome of each kind of failure', () => {
    expect(serviceErrorOutcome(new ServiceError(0))).toBe('offline')
    expect(serviceErrorOutcome(new ServiceError(401))).toBe('denied')
    expect(serviceErrorOutcome(new ServiceError(403))).toBe('denied')
    expect(serviceErrorOutcome(new ServiceError(404))).toBe('notFound')
    expect(serviceErrorOutcome(new ServiceError(409))).toBe('refused')
    expect(serviceErrorOutcome(new ServiceError(422))).toBe('refused')
    expect(serviceErrorOutcome(new ServiceError(500))).toBe('failed')
    expect(serviceErrorOutcome(new Error('thrown in a mapper'))).toBe('failed')
  })
})

describe('serviceErrorFields', () => {
  it('reads field codes only from a service error', () => {
    expect(serviceErrorFields(new ServiceError(422, { fields: { name: 'taken' } }))).toEqual({ name: 'taken' })
    expect(serviceErrorFields(new ServiceError(500))).toEqual({})
    expect(serviceErrorFields(new Error('other'))).toEqual({})
  })
})
