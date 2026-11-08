import { type ReactNode, useContext, useEffect, useId, useRef, useState } from 'react'
import { type FieldValues, useFormState } from 'react-hook-form'

import { useCopy } from '@/feature/copy/useCopy'
import type { CTAPlacedProps } from '@/feature/cta/cta.type'
import { CTABar } from '@/feature/cta/CTABar'
import { Info } from '@/feature/info/Info'
import { LeaveGuardContext } from '@/feature/route/leaveGuardContext'
import { useLeaveGuard } from '@/feature/route/useLeaveGuard'
import { cn } from '@/style/cn'

import type { FormLayout, FormStore } from './form.type'
import { focusFirstInvalidField } from './form.util'
import { FormLayoutContext, FormStoreContext } from './formContext'
import { FORM_SLOT } from './formSlot'
import { useEnclosingForm } from './useEnclosingForm'

type FormProps<TModel extends FieldValues, TOutput> = {
  form: FormStore<TModel, TOutput>
  layout: FormLayout
  'aria-label'?: string
  children: ReactNode
}

type FormSectionProps = {
  title: string
  info?: string
  children: ReactNode
}

type FormFootPrimaryCTA = {
  children: ReactNode
  loading?: boolean
}

type FormFootSecondaryCTA = {
  children: ReactNode
  onClick?: () => void
}

type FormFootProps = {
  primary: FormFootPrimaryCTA
  secondary?: FormFootSecondaryCTA
  tertiary?: readonly CTAPlacedProps[]
  message?: string
}

const FormRoot = <TModel extends FieldValues, TOutput>({ form, layout, children, ...rest }: FormProps<TModel, TOutput>) => {
  useLeaveGuard(form)
  const [focusRequest, setFocusRequest] = useState(0)
  const rootRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (focusRequest > 0 && rootRef.current !== null) focusFirstInvalidField(rootRef.current)
  }, [focusRequest])

  return (
    <FormStoreContext value={form as unknown as FormStore}>
      <FormLayoutContext value={layout}>
        <form
          ref={rootRef}
          noValidate
          data-slot={FORM_SLOT.root}
          data-layout={layout}
          {...rest}
          className={cn('flex w-full flex-col gap-8', ({
            'col-1': 'max-w-xl',
            'col-2': 'max-w-5xl',
          } satisfies Record<FormLayout, string>)[layout])}
          onSubmit={async (event) => {
            event.preventDefault()
            if (await form.submit() === 'invalid') setFocusRequest((count) => count + 1)
          }}
        >
          {children}
        </form>
      </FormLayoutContext>
    </FormStoreContext>
  )
}

FormRoot.displayName = 'Form'

const FormSection = ({ title, info, children }: FormSectionProps) => {
  const { t } = useCopy()
  const layout = useContext(FormLayoutContext)
  const titleId = useId()

  return (
    <fieldset
      data-slot={FORM_SLOT.section}
      aria-labelledby={titleId}
      className="m-0 min-w-0 border-0 p-0"
    >
      <legend className="flex items-center gap-1 p-0">
        <span
          id={titleId}
          data-slot={FORM_SLOT.sectionTitle}
          className="text-subtitle1 text-stress"
        >
          {title}
        </span>
        {info !== undefined && <Info label={t('common.form.about', { label: title })}>{info}</Info>}
      </legend>
      <div className="@container mt-3">
        <div
          data-slot={FORM_SLOT.sectionGrid}
          className={cn('grid grid-cols-1 items-start gap-x-gutter gap-y-2', layout === 'col-2' && '@2xl:grid-cols-2')}
        >
          {children}
        </div>
      </div>
    </fieldset>
  )
}

FormSection.displayName = 'Form.Section'

const FormFoot = ({ primary, secondary, tertiary = [], message }: FormFootProps) => {
  const form = useEnclosingForm()
  const guard = useContext(LeaveGuardContext)
  const formState = useFormState({ control: form.control })
  const unchanged = form.kind === 'edit' && !formState.isDirty
  const refused = formState.isSubmitted && Object.keys(formState.errors).length > 0

  return (
    <div
      data-slot={FORM_SLOT.foot}
      className="flex flex-col gap-3 border-t border-stress-outline pt-4"
    >
      {message !== undefined && (
        <p
          data-slot={FORM_SLOT.footMessage}
          title={message}
          className="min-w-0 truncate text-body2 text-stress-xl"
        >
          {message}
        </p>
      )}
      <CTABar>
        {tertiary.map((cta, index) => (
          <CTABar.CTA
            key={index}
            lane="tertiary"
            variant="tertiary"
            {...cta}
          />
        ))}
        {secondary !== undefined && (
          <CTABar.CTA
            lane="secondary"
            variant="secondary"
            onClick={() => {
              const discard = () => {
                form.revert()
                secondary.onClick?.()
              }
              if (guard !== null && formState.isDirty) guard.confirmDiscard(discard)
              else discard()
            }}
          >
            {secondary.children}
          </CTABar.CTA>
        )}
        <CTABar.CTA
          lane="primary"
          variant="primary"
          type="submit"
          loading={formState.isSubmitting || primary.loading === true}
          unavailable={unchanged || refused}
        >
          {primary.children}
        </CTABar.CTA>
      </CTABar>
    </div>
  )
}

FormFoot.displayName = 'Form.Foot'

const Form = Object.assign(FormRoot, {
  Section: FormSection,
  Foot: FormFoot,
})

export { Form }
export type { FormFootPrimaryCTA, FormFootProps, FormFootSecondaryCTA, FormProps, FormSectionProps }
