import { screen, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Link, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import * as z from 'zod'

import { Form } from '@/feature/form/Form'
import { useForm } from '@/feature/form/useForm'
import { renderWithProviders } from '@/testing/render.unit'

import { LeaveGuardProvider } from './LeaveGuard'
import { useRoute } from './useRoute'

const NoteForm = () => {
  const route = useRoute()
  const form = useForm({
    schema: z.object({ title: z.string().min(1) }),
    defaultValues: { title: 'Saved' },
    onSubmit: (values, store) => {
      store.rebase(values)
      route.navigate('gallery')
    },
  })

  return (
    <Form
      form={form}
      layout="col-1"
    >
      <Form.Section title="Note">
        <form.Field.Text
          name="title"
          label="Title"
        />
      </Form.Section>
      <Form.Foot
        primary={{ children: 'Save' }}
        secondary={{ children: 'Cancel' }}
      />
    </Form>
  )
}

NoteForm.displayName = 'NoteForm'

const Screens = () => {
  const location = useLocation()

  return (
    <LeaveGuardProvider>
      <Link to="/gallery">Gallery</Link>
      {location.pathname === '/' ? <NoteForm /> : <h1>Gallery Screen</h1>}
    </LeaveGuardProvider>
  )
}

Screens.displayName = 'Screens'

const getViewItems = () => ({
  get nav() {
    return { gallery: screen.getByRole('link', { name: 'Gallery' }) }
  },
  get form() {
    return { title: screen.getByLabelText('Title') }
  },
  get dialog() {
    const dialog = screen.getByRole('dialog', { name: 'Discard Changes?' })
    return {
      stay: within(dialog).getByRole('button', { name: 'Keep Editing' }),
      leave: within(dialog).getByRole('button', { name: 'Discard Changes' }),
    }
  },
})

describe('leave guard', () => {
  it('lets a clean form leave without asking', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Screens />)

    await user.click(getViewItems().nav.gallery)

    expect(await screen.findByRole('heading', { name: 'Gallery Screen' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('asks before leaving a dirty form: declining keeps the edit, accepting leaves', async () => {
    const user = userEvent.setup()
    const harness = renderWithProviders(<Screens />)
    const view = getViewItems()

    await user.type(view.form.title, ' and edited')
    await user.click(view.nav.gallery)
    await user.click(view.dialog.stay)

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(harness.router.state.location.pathname).toBe('/')
    expect(view.form.title).toHaveValue('Saved and edited')

    await user.click(view.nav.gallery)
    await user.click(view.dialog.leave)

    expect(await screen.findByRole('heading', { name: 'Gallery Screen' })).toBeInTheDocument()
  })

  it('asks before Cancel drops a dirty draft: declining keeps the edit, accepting reverts it', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Screens />)
    const view = getViewItems()

    await user.type(view.form.title, ' and edited')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await user.click(view.dialog.stay)

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(view.form.title).toHaveValue('Saved and edited')

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await user.click(view.dialog.leave)

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(view.form.title).toHaveValue('Saved')
  })

  it('lets a successful save leave through the plain navigate', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Screens />)
    const view = getViewItems()

    await user.type(view.form.title, ' again')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByRole('heading', { name: 'Gallery Screen' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
