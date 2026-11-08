import type { ReactNode } from 'react'
import type { FieldValues } from 'react-hook-form'

import {
  FormFieldCheckbox,
  type FormFieldCheckboxProps,
  FormFieldDate,
  type FormFieldDateProps,
  FormFieldRadio,
  type FormFieldRadioProps,
  FormFieldSelect,
  type FormFieldSelectProps,
  FormFieldSwitch,
  type FormFieldSwitchProps,
  FormFieldText,
  FormFieldTextArea,
  type FormFieldTextAreaProps,
  type FormFieldTextProps,
} from './FormField'

const FormField = {
  Text: FormFieldText,
  TextArea: FormFieldTextArea,
  Date: FormFieldDate,
  Select: FormFieldSelect,
  Radio: FormFieldRadio,
  Checkbox: FormFieldCheckbox,
  Switch: FormFieldSwitch,
}

type TypedFormField<TModel extends FieldValues> = {
  Text: (props: FormFieldTextProps<TModel>) => ReactNode
  TextArea: (props: FormFieldTextAreaProps<TModel>) => ReactNode
  Date: (props: FormFieldDateProps<TModel>) => ReactNode
  Select: (props: FormFieldSelectProps<TModel>) => ReactNode
  Radio: (props: FormFieldRadioProps<TModel>) => ReactNode
  Checkbox: (props: FormFieldCheckboxProps<TModel>) => ReactNode
  Switch: (props: FormFieldSwitchProps<TModel>) => ReactNode
}

export { FormField }
export type { TypedFormField }
