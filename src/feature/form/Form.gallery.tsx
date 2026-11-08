import { useState } from 'react'
import * as z from 'zod'

import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Form } from './Form'
import type { FieldErrorOutcome } from './form.util'
import { useForm } from './useForm'

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.email({ error: 'email' satisfies FieldErrorOutcome }),
  password: z.string().min(8, { error: 'tooShort' satisfies FieldErrorOutcome }),
  confirm: z.string().min(1),
  acceptTerms: z.literal(true),
}).refine((values) => values.password === values.confirm, { path: ['confirm'], error: 'mismatch' satisfies FieldErrorOutcome })

const settingsSchema = z.object({
  displayName: z.string().min(1),
  language: z.enum(['en', 'fr', 'de']),
  density: z.enum(['comfortable', 'compact']),
  startDate: z.string(),
  notifications: z.boolean(),
  weeklySummary: z.boolean(),
  bio: z.string().max(200),
})

type Settings = z.input<typeof settingsSchema>

const SAVED_SETTINGS: Settings = {
  displayName: 'Example User',
  language: 'en',
  density: 'comfortable',
  startDate: '2026-01-05',
  notifications: true,
  weeklySummary: false,
  bio: '',
}

const wait = () => new Promise<void>((resolve) => {
  setTimeout(resolve, 800)
})

const SignUpExample = () => {
  const form = useForm({
    schema: signUpSchema,
    kind: 'create',
    defaultValues: { name: '', email: '', password: '', confirm: '' },
    onSubmit: wait,
  })

  return (
    <Form
      form={form}
      layout="col-1"
    >
      <Form.Section title="Account">
        <form.Field.Text
          name="name"
          label="Name"
          autoComplete="name"
        />
        <form.Field.Text
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
        />
        <form.Field.Text
          name="password"
          type="password"
          label="Password"
          helper="Use at least 8 characters."
          autoComplete="new-password"
        />
        <form.Field.Text
          name="confirm"
          type="password"
          label="Confirm Password"
          autoComplete="new-password"
        />
        <form.Field.Checkbox
          name="acceptTerms"
          label="I Accept the Terms"
        />
      </Form.Section>
      <Form.Foot primary={{ children: 'Create Account' }} />
    </Form>
  )
}

SignUpExample.displayName = 'SignUpExample'

const SettingsExample = () => {
  const [saved, setSaved] = useState(SAVED_SETTINGS)
  const form = useForm({
    schema: settingsSchema,
    defaultValues: saved,
    onSubmit: async (values, store) => {
      await wait()
      setSaved(values)
      store.rebase(values)
    },
  })

  return (
    <Form
      form={form}
      layout="col-2"
    >
      <Form.Section
        title="Profile"
        info="Shown to everyone you share items with."
      >
        <form.Field.Text
          name="displayName"
          label="Display Name"
        />
        <form.Field.Select
          name="language"
          label="Language"
          options={[
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
          ]}
        />
        <form.Field.Date
          name="startDate"
          label="Start Date"
          helper="Items before this date are hidden."
        />
        <form.Field.Radio
          name="density"
          label="Density"
          options={[
            { value: 'comfortable', label: 'Comfortable' },
            { value: 'compact', label: 'Compact' },
          ]}
        />
        <form.Field.TextArea
          name="bio"
          label="Bio"
          helper="Up to 200 characters."
        />
      </Form.Section>
      <Form.Section title="Notifications">
        <form.Field.Switch
          name="notifications"
          label="Email Notifications"
        />
        <form.Field.Switch
          name="weeklySummary"
          label="Weekly Summary"
          info="A digest of the week's changes, sent on Mondays."
        />
      </Form.Section>
      <Form.Foot
        message="Changes apply on every device you are signed in on."
        primary={{ children: 'Save' }}
        secondary={{ children: 'Cancel' }}
      />
    </Form>
  )
}

SettingsExample.displayName = 'SettingsExample'

const ValidationExample = () => {
  const form = useForm({
    schema: signUpSchema,
    kind: 'create',
    defaultValues: { name: 'Example', email: 'not-an-email', password: 'short', confirm: 'other' },
    onSubmit: wait,
  })

  return (
    <Form
      form={form}
      layout="col-2"
    >
      <Form.Section title="Check These Fields">
        <form.Field.Text
          name="name"
          label="Name"
        />
        <form.Field.Text
          name="email"
          type="email"
          label="Email"
        />
        <form.Field.Text
          name="password"
          type="password"
          label="Password"
          helper="Use at least 8 characters."
        />
        <form.Field.Text
          name="confirm"
          type="password"
          label="Confirm Password"
        />
        <form.Field.Checkbox
          name="acceptTerms"
          label="I Accept the Terms"
        />
      </Form.Section>
      <Form.Foot primary={{ children: 'Check' }} />
    </Form>
  )
}

ValidationExample.displayName = 'ValidationExample'

const gallery: GalleryEntry = {
  title: 'Form',
  group: 'form',
  examples: [
    { name: 'Sign Up', render: () => <SignUpExample /> },
    { name: 'Settings', render: () => <SettingsExample /> },
    { name: 'Validation, Press Check', render: () => <ValidationExample /> },
  ],
}

export { gallery }
