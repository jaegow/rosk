import { act, renderHook } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import * as z from 'zod'

import { useForm } from '@/feature/form/useForm'
import { i18n } from '@/feature/i18n/i18n.config'
import { toastRaised } from '@/testing/helpers/toastRaised'

import { ServiceError } from './serviceError'
import { useServiceError } from './useServiceError'

const withCopy = ({ children }: { children: ReactNode }) => createElement(I18nextProvider, { i18n }, children)

const renderHandler = () => renderHook(() => ({
  serviceError: useServiceError(),
  form: useForm({
    schema: z.object({ name: z.string().min(1) }),
    kind: 'create',
    defaultValues: { name: 'Example' },
    onSubmit: () => undefined,
  }),
}), { wrapper: withCopy })

describe('useServiceError', () => {
  it('pins a field-keyed refusal on its field and raises no toast', () => {
    const hook = renderHandler()

    act(() => hook.result.current.serviceError.handle(new ServiceError(422, { fields: { name: 'tooShort', unknown: 'taken' } }), hook.result.current.form))

    expect(hook.result.current.form.getFieldState('name').error).toMatchObject({ type: 'server', message: 'tooShort' })
    expect(toastRaised()).toEqual([])
  })

  it('pins a field code it does not know as the generic invalid outcome', () => {
    const hook = renderHandler()

    act(() => hook.result.current.serviceError.handle(new ServiceError(422, { fields: { name: 'taken' } }), hook.result.current.form))

    expect(hook.result.current.form.getFieldState('name').error).toMatchObject({ type: 'server', message: 'invalid' })
  })

  it('raises an error toast in our copy for a failure no field owns', () => {
    const hook = renderHandler()

    act(() => hook.result.current.serviceError.handle(new ServiceError(503, { code: 'down' }), hook.result.current.form))
    act(() => hook.result.current.serviceError.handle(new ServiceError(0)))

    expect(toastRaised()).toEqual([
      { id: expect.any(String), severity: 'danger', title: 'Something Went Wrong', description: 'Try again in a moment.', scope: 'component' },
      { id: expect.any(String), severity: 'danger', title: 'You\'re Offline', description: 'Check your connection, then try again.', scope: 'component' },
    ])
  })
})
