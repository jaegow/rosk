import { Checkbox, RadioGroup, Select, Switch } from 'radix-ui'
import { type ReactNode, useContext } from 'react'
import type { FieldPathByValue, FieldValues } from 'react-hook-form'

import { useCopy } from '@/feature/copy/useCopy'
import { CTA } from '@/feature/cta/CTA'
import { Icon } from '@/feature/icon/Icon'
import { Info } from '@/feature/info/Info'
import { OverlaySurface } from '@/feature/popover/OverlaySurface'
import { cn } from '@/style/cn'
import { remToPixel } from '@/style/remToPixel'

import { fieldErrorOutcome, isEmptyValue } from './form.util'
import { FormLayoutContext } from './formContext'
import { FORM_FIELD_SLOT } from './formSlot'
import { type FormFieldState, useFormField } from './useFormField'

type FormFieldBaseProps = {
  label: string
  helper?: string
  info?: string
}

type FormFieldOption = {
  value: string
  label: string
}

type FormFieldTextType = 'text' | 'email' | 'password' | 'number'

type FormFieldTextName<TModel extends FieldValues> = FieldPathByValue<TModel, string | undefined>

type FormFieldToggleName<TModel extends FieldValues> = FieldPathByValue<TModel, boolean | undefined>

type FormFieldTextProps<TModel extends FieldValues = FieldValues> = FormFieldBaseProps & {
  name: FormFieldTextName<TModel>
  type?: FormFieldTextType
  autoComplete?: string
}

type FormFieldTextAreaProps<TModel extends FieldValues = FieldValues> = FormFieldBaseProps & {
  name: FormFieldTextName<TModel>
}

type FormFieldDateProps<TModel extends FieldValues = FieldValues> = FormFieldBaseProps & {
  name: FormFieldTextName<TModel>
}

type FormFieldSelectProps<TModel extends FieldValues = FieldValues> = FormFieldBaseProps & {
  name: FormFieldTextName<TModel>
  options: readonly FormFieldOption[]
}

type FormFieldRadioProps<TModel extends FieldValues = FieldValues> = FormFieldBaseProps & {
  name: FormFieldTextName<TModel>
  options: readonly FormFieldOption[]
}

type FormFieldCheckboxProps<TModel extends FieldValues = FieldValues> = FormFieldBaseProps & {
  name: FormFieldToggleName<TModel>
}

type FormFieldSwitchProps<TModel extends FieldValues = FieldValues> = FormFieldBaseProps & {
  name: FormFieldToggleName<TModel>
}

type FormFieldHolds = 'entry' | 'toggle' | 'group'

type FormFieldFrameProps = FormFieldBaseProps & {
  field: FormFieldState
  holds: FormFieldHolds
  wide?: boolean
  clearable?: boolean
  children: ReactNode
}

const FormFieldFrame = ({ field, label, helper, info, holds, wide = false, clearable = false, children }: FormFieldFrameProps) => {
  const { t } = useCopy()
  const layout = useContext(FormLayoutContext)
  const error = field.controller.fieldState.error
  const value: unknown = field.controller.field.value
  const marker = field.required && (
    <span
      aria-hidden="true"
      data-slot={FORM_FIELD_SLOT.requiredMarker}
      className="ms-0.5 text-stress-xl"
    >
      *
    </span>
  )
  const about = info !== undefined && <Info label={t('common.form.about', { label })}>{info}</Info>

  return (
    <div
      data-slot={FORM_FIELD_SLOT.root}
      data-name={field.name}
      data-invalid={field.invalid || undefined}
      className={cn('flex min-w-0 flex-col gap-1', wide && 'col-span-full', holds === 'toggle' && layout === 'col-2' && '@2xl:pt-6')}
    >
      {holds === 'toggle'
        ? (
          <div className="flex min-h-10 items-center gap-2">
            {children}
            <label
              id={field.ids.label}
              htmlFor={field.ids.control}
              data-slot={FORM_FIELD_SLOT.label}
              className="cursor-pointer text-body2 text-stress"
            >
              {label}
            </label>
            {marker}
            {about}
          </div>
        )
        : (
          <>
            <div className="flex items-center gap-1">
              {holds === 'group'
                ? (
                  <span
                    id={field.ids.label}
                    data-slot={FORM_FIELD_SLOT.label}
                    className="text-subtitle2 text-stress"
                  >
                    {label}
                  </span>
                )
                : (
                  <label
                    id={field.ids.label}
                    htmlFor={field.ids.control}
                    data-slot={FORM_FIELD_SLOT.label}
                    className="text-subtitle2 text-stress"
                  >
                    {label}
                  </label>
                )}
              {marker}
              {about}
            </div>
            {holds === 'entry'
              ? (
                <div
                  data-slot={FORM_FIELD_SLOT.box}
                  className={cn(
                    'relative flex min-w-0 items-center rounded-md border bg-base text-stress focus-within:focus-ring',
                    field.invalid ? 'border-danger' : 'border-stress-outline',
                  )}
                >
                  {children}
                  {clearable && !isEmptyValue(value) && (
                    <span className="absolute inset-y-0 end-1 flex items-center">
                      <CTA
                        data-slot={FORM_FIELD_SLOT.clearCTA}
                        iconOnly="close"
                        aria-label={t('common.form.clear', { label })}
                        variant="tertiary"
                        size="sm"
                        tabIndex={-1}
                        onClick={() => {
                          field.controller.field.onChange('')
                          document.getElementById(field.ids.control)?.focus()
                        }}
                      />
                    </span>
                  )}
                </div>
              )
              : children}
          </>
        )}
      <div
        id={field.ids.message}
        data-slot={FORM_FIELD_SLOT.message}
        className="flex min-h-5 items-start gap-1 text-body3"
      >
        {error === undefined
          ? helper !== undefined && <span className="text-stress-xl">{helper}</span>
          : (
            <>
              <span className="inline-flex text-danger">
                <Icon
                  name="error"
                  size="sm"
                />
              </span>
              <span className="text-stress">
                {((): string => {
                  switch (fieldErrorOutcome(error.message, value)) {
                    case 'required':
                      return t('common.form.error.required')
                    case 'email':
                      return t('common.form.error.email')
                    case 'tooShort':
                      return t('common.form.error.tooShort')
                    case 'mismatch':
                      return t('common.form.error.mismatch')
                    case 'invalid':
                      return t('common.form.error.invalid')
                    case null:
                      return error.message ?? ''
                  }
                })()}
              </span>
            </>
          )}
      </div>
    </div>
  )
}

FormFieldFrame.displayName = 'FormFieldFrame'

const FormFieldText = <TModel extends FieldValues = FieldValues>({ name, type = 'text', autoComplete, ...base }: FormFieldTextProps<TModel>) => {
  const field = useFormField(name, base.helper)

  return (
    <FormFieldFrame
      field={field}
      holds="entry"
      clearable
      {...base}
    >
      <input
        id={field.ids.control}
        data-slot={FORM_FIELD_SLOT.control}
        name={field.name}
        type={type}
        autoComplete={autoComplete}
        value={field.controller.field.value ?? ''}
        onChange={field.controller.field.onChange}
        onBlur={field.controller.field.onBlur}
        {...field.aria}
        className="h-10 w-full min-w-0 rounded-md bg-transparent ps-3 pe-10 text-body2 text-stress outline-none"
      />
    </FormFieldFrame>
  )
}

FormFieldText.displayName = 'FormField.Text'

const FormFieldTextArea = <TModel extends FieldValues = FieldValues>({ name, ...base }: FormFieldTextAreaProps<TModel>) => {
  const field = useFormField(name, base.helper)

  return (
    <FormFieldFrame
      field={field}
      holds="entry"
      wide
      {...base}
    >
      <textarea
        id={field.ids.control}
        data-slot={FORM_FIELD_SLOT.control}
        name={field.name}
        rows={4}
        value={field.controller.field.value ?? ''}
        onChange={field.controller.field.onChange}
        onBlur={field.controller.field.onBlur}
        {...field.aria}
        className="min-h-24 w-full min-w-0 resize-y rounded-md bg-transparent px-3 py-2 text-body2 text-stress outline-none"
      />
    </FormFieldFrame>
  )
}

FormFieldTextArea.displayName = 'FormField.TextArea'

const FormFieldDate = <TModel extends FieldValues = FieldValues>({ name, ...base }: FormFieldDateProps<TModel>) => {
  const field = useFormField(name, base.helper)

  return (
    <FormFieldFrame
      field={field}
      holds="entry"
      clearable
      {...base}
    >
      <input
        id={field.ids.control}
        data-slot={FORM_FIELD_SLOT.control}
        name={field.name}
        type="date"
        value={field.controller.field.value ?? ''}
        onChange={field.controller.field.onChange}
        onBlur={field.controller.field.onBlur}
        {...field.aria}
        className="h-10 w-full min-w-0 rounded-md bg-transparent ps-3 pe-10 text-body2 text-stress outline-none"
      />
    </FormFieldFrame>
  )
}

FormFieldDate.displayName = 'FormField.Date'

const FormFieldSelect = <TModel extends FieldValues = FieldValues>({ name, options, ...base }: FormFieldSelectProps<TModel>) => {
  const { t } = useCopy()
  const field = useFormField(name, base.helper)

  return (
    <FormFieldFrame
      field={field}
      holds="entry"
      {...base}
    >
      <Select.Root
        value={field.controller.field.value ?? ''}
        onValueChange={field.controller.field.onChange}
      >
        <Select.Trigger
          id={field.ids.control}
          data-slot={FORM_FIELD_SLOT.control}
          onBlur={field.controller.field.onBlur}
          {...field.aria}
          className="flex h-10 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-md bg-transparent px-3 text-body2 text-stress outline-none data-placeholder:text-stress-xl"
        >
          <span className="min-w-0 truncate">
            <Select.Value placeholder={t('common.form.choose')} />
          </span>
          <Select.Icon className="inline-flex text-stress-xl">
            <Icon
              name="chevron-down"
              size="sm"
            />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={remToPixel(0.25)}
            collisionPadding={remToPixel(0.5)}
            className="z-dropdown w-(--radix-select-trigger-width)"
          >
            <OverlaySurface
              layer="dropdown"
              density="sm"
            >
              <Select.Viewport className="flex flex-col py-1">
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    data-slot={FORM_FIELD_SLOT.option}
                    className="flex h-8 cursor-pointer items-center gap-2 rounded-sm px-2 text-body2 text-stress outline-none select-none data-highlighted:stress-hover"
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator className="ms-auto inline-flex">
                      <Icon
                        name="check"
                        size="sm"
                      />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </OverlaySurface>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </FormFieldFrame>
  )
}

FormFieldSelect.displayName = 'FormField.Select'

const FormFieldRadio = <TModel extends FieldValues = FieldValues>({ name, options, ...base }: FormFieldRadioProps<TModel>) => {
  const field = useFormField(name, base.helper)

  return (
    <FormFieldFrame
      field={field}
      holds="group"
      {...base}
    >
      <RadioGroup.Root
        aria-labelledby={field.ids.label}
        value={field.controller.field.value ?? ''}
        onValueChange={field.controller.field.onChange}
        onBlur={field.controller.field.onBlur}
        {...field.aria}
        className="flex flex-col gap-1"
      >
        {options.map((option, index) => (
          <div
            key={option.value}
            className="flex min-h-8 items-center gap-2"
          >
            <RadioGroup.Item
              id={`${field.ids.control}${index}`}
              value={option.value}
              data-slot={FORM_FIELD_SLOT.control}
              className={cn(
                'inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-base focus-visible:focus-ring',
                field.invalid ? 'border-danger' : 'border-stress-outline data-[state=checked]:border-brand',
              )}
            >
              <RadioGroup.Indicator className="size-2.5 rounded-full bg-brand" />
            </RadioGroup.Item>
            <label
              htmlFor={`${field.ids.control}${index}`}
              className="cursor-pointer text-body2 text-stress"
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup.Root>
    </FormFieldFrame>
  )
}

FormFieldRadio.displayName = 'FormField.Radio'

const FormFieldCheckbox = <TModel extends FieldValues = FieldValues>({ name, ...base }: FormFieldCheckboxProps<TModel>) => {
  const field = useFormField(name, base.helper)

  return (
    <FormFieldFrame
      field={field}
      holds="toggle"
      {...base}
    >
      <Checkbox.Root
        id={field.ids.control}
        data-slot={FORM_FIELD_SLOT.control}
        checked={field.controller.field.value === true}
        onCheckedChange={(checked) => field.controller.field.onChange(checked === true)}
        onBlur={field.controller.field.onBlur}
        {...field.aria}
        className={cn(
          'inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border bg-base text-base focus-visible:focus-ring data-[state=checked]:bg-brand',
          field.invalid ? 'border-danger' : 'border-stress-outline data-[state=checked]:border-brand',
        )}
      >
        <Checkbox.Indicator className="inline-flex">
          <Icon
            name="check"
            size="sm"
          />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </FormFieldFrame>
  )
}

FormFieldCheckbox.displayName = 'FormField.Checkbox'

const FormFieldSwitch = <TModel extends FieldValues = FieldValues>({ name, ...base }: FormFieldSwitchProps<TModel>) => {
  const field = useFormField(name, base.helper)

  return (
    <FormFieldFrame
      field={field}
      holds="toggle"
      {...base}
    >
      <Switch.Root
        id={field.ids.control}
        data-slot={FORM_FIELD_SLOT.control}
        checked={field.controller.field.value === true}
        onCheckedChange={field.controller.field.onChange}
        onBlur={field.controller.field.onBlur}
        {...field.aria}
        className={cn(
          'inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border bg-stress-sm p-0.5 focus-visible:focus-ring data-[state=checked]:bg-brand',
          field.invalid ? 'border-danger' : 'border-stress-outline',
        )}
      >
        <Switch.Thumb className="block size-4 rounded-full bg-base shadow-sm data-[state=checked]:translate-x-4" />
      </Switch.Root>
    </FormFieldFrame>
  )
}

FormFieldSwitch.displayName = 'FormField.Switch'

export { FormFieldCheckbox, FormFieldDate, FormFieldRadio, FormFieldSelect, FormFieldSwitch, FormFieldText, FormFieldTextArea }
export type {
  FormFieldBaseProps,
  FormFieldCheckboxProps,
  FormFieldDateProps,
  FormFieldOption,
  FormFieldRadioProps,
  FormFieldSelectProps,
  FormFieldSwitchProps,
  FormFieldTextAreaProps,
  FormFieldTextProps,
  FormFieldTextType,
}
