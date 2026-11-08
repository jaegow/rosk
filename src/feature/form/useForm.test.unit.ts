import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import * as z from 'zod'

import { getToastSnapshot } from '@/feature/toast/toast.store'

import { useForm } from './useForm'

const schema = z.object({
  title: z.string().min(1),
  note: z.string(),
})

type Item = z.input<typeof schema>

const saved: Item = { title: 'First', note: 'Kept' }

describe('useForm', () => {
  it('derives the required fields from its schema', () => {
    const view = renderHook(() => useForm({ schema, defaultValues: saved, onSubmit: vi.fn() }))

    expect([...view.result.current.requiredNames]).toEqual(['title'])
  })

  it('refuses to submit a clean edit form, saying there is nothing to save', async () => {
    const onSubmit = vi.fn()
    const view = renderHook(() => useForm({ schema, defaultValues: saved, onSubmit }))

    await act(async () => {
      expect(await view.result.current.submit()).toBe('unchanged')
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(getToastSnapshot().shown).toEqual([expect.objectContaining({ severity: 'info', title: 'Nothing to Save', description: 'Change a field, then save.' })])
  })

  it('validates a create form, submitting only once it is valid', async () => {
    const onSubmit = vi.fn()
    const view = renderHook(() => useForm({ schema, kind: 'create', defaultValues: { title: '', note: '' }, onSubmit }))

    await act(async () => {
      expect(await view.result.current.submit()).toBe('invalid')
    })
    expect(onSubmit).not.toHaveBeenCalled()
    expect(view.result.current.getFieldState('title').invalid).toBe(true)

    act(() => view.result.current.setValue('title', 'New', { shouldDirty: true }))
    await act(async () => {
      expect(await view.result.current.submit()).toBe('submitted')
    })
    expect(onSubmit).toHaveBeenCalledWith({ title: 'New', note: '' }, view.result.current)
  })

  it('reverts the draft to the baseline and rebases the baseline onto saved values', () => {
    const view = renderHook(() => useForm({ schema, defaultValues: saved, onSubmit: vi.fn() }))

    act(() => view.result.current.setValue('title', 'Edited', { shouldDirty: true }))
    expect(view.result.current.formState.isDirty).toBe(true)

    act(() => view.result.current.revert())
    expect(view.result.current.getValues()).toEqual(saved)
    expect(view.result.current.formState.isDirty).toBe(false)

    act(() => view.result.current.setValue('title', 'Edited', { shouldDirty: true }))
    act(() => view.result.current.rebase({ title: 'Edited', note: 'Kept' }))
    expect(view.result.current.formState.isDirty).toBe(false)
  })

  it('keeps edited fields when rebasing with keepEdits', () => {
    const view = renderHook(() => useForm({ schema, defaultValues: saved, onSubmit: vi.fn() }))

    act(() => view.result.current.setValue('title', 'Edited', { shouldDirty: true }))
    act(() => view.result.current.rebase({ title: 'Moved', note: 'Moved' }, { keepEdits: true }))

    expect(view.result.current.getValues()).toEqual({ title: 'Edited', note: 'Moved' })
  })

  it('re-seeds a clean form when its record moves, and warns a dirty one, loading the latest on request', () => {
    const view = renderHook((record: Item) => useForm({ schema, defaultValues: record, onSubmit: vi.fn() }), { initialProps: saved })

    view.rerender({ title: 'Second', note: 'Kept' })
    expect(view.result.current.getValues()).toEqual({ title: 'Second', note: 'Kept' })
    expect(getToastSnapshot().shown).toEqual([])

    act(() => view.result.current.setValue('note', 'Mine', { shouldDirty: true }))
    view.rerender({ title: 'Third', note: 'Kept' })

    expect(view.result.current.getValues()).toEqual({ title: 'Second', note: 'Mine' })
    const warning = getToastSnapshot().shown[0]
    expect(warning).toEqual(expect.objectContaining({ severity: 'warning', title: 'Updated Elsewhere', cta: expect.objectContaining({ label: 'Load Latest' }) }))

    act(() => warning?.cta?.onPress())
    expect(view.result.current.getValues()).toEqual({ title: 'Third', note: 'Kept' })
    expect(view.result.current.formState.isDirty).toBe(false)
    expect(getToastSnapshot().shown).toEqual([])
  })

  it('takes a record that moves during its own save silently, keeping edits', async () => {
    const save = { resolve: () => {} }
    const onSubmit = vi.fn(() => new Promise<void>((resolve) => {
      save.resolve = resolve
    }))
    const view = renderHook((record: Item) => useForm({ schema, defaultValues: record, onSubmit }), { initialProps: saved })

    act(() => view.result.current.setValue('title', 'Saved', { shouldDirty: true }))
    act(() => view.result.current.setValue('note', 'Draft', { shouldDirty: true }))
    const submitting = view.result.current.submit()
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ title: 'Saved', note: 'Draft' }, expect.any(Object)))
    view.rerender({ title: 'Saved', note: 'Kept' })
    save.resolve()
    await act(() => submitting)

    expect(view.result.current.getValues()).toEqual({ title: 'Saved', note: 'Draft' })
    expect(getToastSnapshot().shown).toEqual([])
  })
})
