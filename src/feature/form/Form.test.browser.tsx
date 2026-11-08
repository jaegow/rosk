import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import * as z from 'zod'

import { ui_cta, ui_field } from '@/testing/helpers/ui.browser'
import { renderWithProviders } from '@/testing/render.browser'

import { Form } from './Form'
import type { FieldErrorOutcome } from './form.util'
import { useForm } from './useForm'

const schema = z.object({
  name: z.string().min(1),
  email: z.email({ error: 'email' satisfies FieldErrorOutcome }),
  plan: z.enum(['basic', 'plus']),
  size: z.enum(['small', 'large']),
  start: z.string(),
  agree: z.literal(true),
  alerts: z.boolean(),
})

type Values = z.output<typeof schema>

type ExampleFormProps = {
  onSubmit: (values: Values) => void | Promise<void>
}

const ExampleForm = ({ onSubmit }: ExampleFormProps) => {
  const form = useForm({
    schema,
    kind: 'create',
    defaultValues: { name: '', email: '', start: '', alerts: false },
    onSubmit: (values) => onSubmit(values),
  })

  return (
    <Form
      form={form}
      layout="col-2"
    >
      <Form.Section title="Details">
        <form.Field.Text
          name="name"
          label="Name"
          helper="Shown on every item you create."
        />
        <form.Field.Text
          name="email"
          type="email"
          label="Email"
        />
        <form.Field.Select
          name="plan"
          label="Plan"
          options={[
            { value: 'basic', label: 'Basic' },
            { value: 'plus', label: 'Plus' },
          ]}
        />
        <form.Field.Radio
          name="size"
          label="Size"
          helper="Pick one."
          options={[
            { value: 'small', label: 'Small' },
            { value: 'large', label: 'Large' },
          ]}
        />
        <form.Field.Date
          name="start"
          label="Start Date"
        />
        <form.Field.Checkbox
          name="agree"
          label="I Agree"
        />
        <form.Field.Switch
          name="alerts"
          label="Alerts"
          helper="Sent by email."
        />
      </Form.Section>
      <Form.Foot primary={{ children: 'Create' }} />
    </Form>
  )
}

const fillValid = async () => {
  await ui_field('Name').fill('Example')
  await ui_field('Email').fill('someone@example.com')
  await userEvent.click(page.getByRole('combobox', { name: 'Plan' }))
  await userEvent.click(page.getByRole('option', { name: 'Plus' }))
  await userEvent.click(page.getByRole('radio', { name: 'Large' }))
  await userEvent.click(page.getByRole('checkbox', { name: 'I Agree' }))
}

describe('Form', () => {
  it('submits the values the user typed and chose', async () => {
    const onSubmit = vi.fn()
    await renderWithProviders(<ExampleForm onSubmit={onSubmit} />)

    await fillValid()
    await ui_field('Start Date').fill('2026-03-14')
    await ui_cta('Create').press()

    await expect.poll(() => onSubmit.mock.calls.length).toBe(1)
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Example', email: 'someone@example.com', plan: 'plus', size: 'large', start: '2026-03-14', agree: true, alerts: false })
  })

  it('focuses the first invalid field on a failed submit and describes each error on its field', async () => {
    const onSubmit = vi.fn()
    await renderWithProviders(<ExampleForm onSubmit={onSubmit} />)
    const name = page.getByRole('textbox', { name: 'Name' })

    await ui_field('Email').fill('someone')
    await ui_cta('Create').press()

    await expect.element(name).toHaveFocus()
    await expect.element(name).toHaveAttribute('aria-invalid', 'true')
    await expect.element(name).toHaveAccessibleDescription('This field is required.')
    await expect.element(page.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('Enter a valid email address.')
    await expect.element(page.getByRole('combobox', { name: 'Plan' })).toHaveAccessibleDescription('This field is required.')
    await expect.element(page.getByRole('radiogroup', { name: 'Size' })).toHaveAccessibleDescription('This field is required.')
    await expect.element(page.getByRole('checkbox', { name: 'I Agree' })).toHaveAccessibleDescription('This field is required.')
    expect(onSubmit).not.toHaveBeenCalled()

    await ui_field('Name').fill('Example')
    await expect.element(name).toHaveAccessibleDescription('Shown on every item you create.')
    await expect.element(name).not.toHaveAttribute('aria-invalid')
  })

  it('names each control by its label and describes it by its helper text', async () => {
    await renderWithProviders(<ExampleForm onSubmit={vi.fn()} />)

    await expect.element(page.getByRole('textbox', { name: 'Name' })).toHaveAccessibleDescription('Shown on every item you create.')
    await expect.element(page.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-required', 'true')
    await expect.element(page.getByRole('combobox', { name: 'Plan' })).toBeInTheDocument()
    await expect.element(page.getByRole('radiogroup', { name: 'Size' })).toHaveAccessibleDescription('Pick one.')
    await expect.element(page.getByRole('checkbox', { name: 'I Agree' })).toBeInTheDocument()
    await expect.element(page.getByRole('switch', { name: 'Alerts' })).toHaveAccessibleDescription('Sent by email.')
    await expect.element(page.getByRole('switch', { name: 'Alerts' })).not.toHaveAttribute('aria-required')
    await expect.element(page.getByRole('group', { name: 'Details' })).toBeInTheDocument()
  })

  it('clears a filled field from inside its box and returns focus to it', async () => {
    await renderWithProviders(<ExampleForm onSubmit={vi.fn()} />)
    const name = page.getByRole('textbox', { name: 'Name' })
    const clear = page.getByRole('button', { name: 'Clear Name' })

    await expect.poll(() => clear.query()).toBeNull()
    await ui_field('Name').fill('Example')
    await userEvent.click(clear)

    await expect.element(name).toHaveValue('')
    await expect.element(name).toHaveFocus()
    await expect.poll(() => clear.query()).toBeNull()
  })

  it('operates the select, radio, checkbox and switch from the keyboard', async () => {
    await renderWithProviders(<ExampleForm onSubmit={vi.fn()} />)
    const plan = page.getByRole('combobox', { name: 'Plan' })
    const agree = page.getByRole('checkbox', { name: 'I Agree' })
    const alerts = page.getByRole('switch', { name: 'Alerts' })

    ;(plan.element() as HTMLElement).focus()
    await expect.element(plan).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(page.getByRole('option', { name: 'Basic' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(page.getByRole('option', { name: 'Plus' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect.element(plan).toHaveTextContent('Plus')
    await expect.poll(() => page.getByRole('listbox').query()).toBeNull()
    await expect.element(plan).toHaveFocus()

    const small = page.getByRole('radio', { name: 'Small' })
    ;(small.element() as HTMLElement).focus()
    await expect.element(small).toHaveFocus()
    await userEvent.keyboard('{ArrowDown>}')
    await expect.element(page.getByRole('radio', { name: 'Large' })).toBeChecked()
    await userEvent.keyboard('{/ArrowDown}')

    ;(agree.element() as HTMLElement).focus()
    await expect.element(agree).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect.element(agree).toBeChecked()

    ;(alerts.element() as HTMLElement).focus()
    await expect.element(alerts).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect.element(alerts).toBeChecked()
  })

  it('shows loading on submit until the save settles', async () => {
    const save = { resolve: () => {} }
    const onSubmit = vi.fn(() => new Promise<void>((resolve) => {
      save.resolve = resolve
    }))
    await renderWithProviders(<ExampleForm onSubmit={onSubmit} />)
    const create = ui_cta('Create')

    await fillValid()
    await create.press()

    await expect.poll(() => create.isBusy()).toBe(true)
    save.resolve()
    await expect.poll(() => create.isBusy()).toBe(false)
  })
})
