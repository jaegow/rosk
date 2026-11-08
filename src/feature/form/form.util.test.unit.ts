import { describe, expect, it } from 'vitest'
import * as z from 'zod'

import { fieldErrorOutcome, isDeepEqual, requiredFieldNames, serverFieldErrorOutcome } from './form.util'

describe('requiredFieldNames', () => {
  it('names each field whose schema refuses every empty value, nested objects by dotted path', () => {
    const schema = z.object({
      name: z.string().min(1),
      nickname: z.string(),
      email: z.email(),
      age: z.number().optional(),
      plan: z.enum(['basic', 'plus']),
      bio: z.string().max(200).or(z.literal('')),
      acceptTerms: z.literal(true),
      newsletter: z.boolean(),
      tags: z.array(z.string()).min(1),
      address: z.object({
        city: z.string().min(1),
        line2: z.string().optional(),
      }),
    })

    expect(requiredFieldNames(schema)).toEqual(['name', 'email', 'plan', 'acceptTerms', 'tags', 'address.city'])
  })

  it('names the fields of a refined object schema', () => {
    const schema = z.object({ password: z.string().min(8), confirm: z.string().min(1) })
      .refine((values) => values.password === values.confirm, { path: ['confirm'], error: 'mismatch' })

    expect(requiredFieldNames(schema)).toEqual(['password', 'confirm'])
  })

  it('names nothing for a schema that is not an object', () => {
    expect(requiredFieldNames(z.string().min(1))).toEqual([])
  })
})

describe('fieldErrorOutcome', () => {
  it('reads an empty value as required whatever the message', () => {
    expect(fieldErrorOutcome('tooShort', '')).toBe('required')
    expect(fieldErrorOutcome(undefined, undefined)).toBe('required')
    expect(fieldErrorOutcome('Invalid input', false)).toBe('required')
  })

  it('reads a known outcome from the message of a filled value', () => {
    expect(fieldErrorOutcome('email', 'someone')).toBe('email')
    expect(fieldErrorOutcome('tooShort', 'abc')).toBe('tooShort')
    expect(fieldErrorOutcome('mismatch', 'abc')).toBe('mismatch')
    expect(fieldErrorOutcome('invalid', 'abc')).toBe('invalid')
  })

  it('has no outcome for a message it does not know, so the raw message shows', () => {
    expect(fieldErrorOutcome('Too big', '999')).toBeNull()
  })
})

describe('serverFieldErrorOutcome', () => {
  it('keeps a known outcome code and reads any other code as invalid', () => {
    expect(serverFieldErrorOutcome('email')).toBe('email')
    expect(serverFieldErrorOutcome('taken')).toBe('invalid')
  })
})

describe('isDeepEqual', () => {
  it('compares plain values structurally, ignoring key order', () => {
    expect(isDeepEqual({ a: 1, b: { c: [1, 2] } }, { b: { c: [1, 2] }, a: 1 })).toBe(true)
    expect(isDeepEqual({ a: 1 }, { a: 2 })).toBe(false)
    expect(isDeepEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false)
    expect(isDeepEqual([1], { 0: 1 })).toBe(false)
    expect(isDeepEqual(null, {})).toBe(false)
  })
})
