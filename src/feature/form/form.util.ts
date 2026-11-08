import * as z from 'zod'

import { FORM_FIELD_SLOT } from './formSlot'

type FieldErrorOutcome = 'required' | 'email' | 'tooShort' | 'mismatch' | 'invalid'

const FIELD_ERROR_OUTCOMES: readonly FieldErrorOutcome[] = ['required', 'email', 'tooShort', 'mismatch', 'invalid']

const EMPTY_VALUES: readonly unknown[] = [undefined, null, '', false, []]

const isEmptyValue = (value: unknown): boolean =>
  value === undefined || value === null || value === '' || value === false || (Array.isArray(value) && value.length === 0)

const requiredFieldNames = (schema: z.core.$ZodType, prefix = ''): string[] => {
  if (!(schema instanceof z.ZodObject)) return []
  return Object.entries(schema.shape).flatMap(([key, field]: [string, z.core.$ZodType]) => {
    if (field instanceof z.ZodObject) return requiredFieldNames(field, `${prefix}${key}.`)
    return EMPTY_VALUES.some((value) => z.safeParse(field, value).success) ? [] : [`${prefix}${key}`]
  })
}

const isDeepEqual = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) return true
  if (typeof left !== 'object' || typeof right !== 'object' || left === null || right === null) return false
  if (Array.isArray(left) !== Array.isArray(right)) return false
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key) => Object.hasOwn(right, key) && isDeepEqual((left as Record<string, unknown>)[key], (right as Record<string, unknown>)[key]))
}

const fieldErrorOutcome = (message: string | undefined, value: unknown): FieldErrorOutcome | null => {
  if (isEmptyValue(value)) return 'required'
  return FIELD_ERROR_OUTCOMES.find((outcome) => outcome === message) ?? null
}

const serverFieldErrorOutcome = (code: string): FieldErrorOutcome => FIELD_ERROR_OUTCOMES.find((outcome) => outcome === code) ?? 'invalid'

const focusFirstInvalidField = (root: HTMLElement) => {
  root.querySelector<HTMLElement>(`[data-slot="${FORM_FIELD_SLOT.root}"][data-invalid] [data-slot="${FORM_FIELD_SLOT.control}"]`)?.focus()
}

export { fieldErrorOutcome, focusFirstInvalidField, isDeepEqual, isEmptyValue, requiredFieldNames, serverFieldErrorOutcome }
export type { FieldErrorOutcome }
