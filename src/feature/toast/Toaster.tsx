import { Toast as ToastPrimitive } from 'radix-ui'
import { useSyncExternalStore } from 'react'

import { SeverityIcon } from '@/feature/alert/SeverityIcon'
import { useCopy } from '@/feature/copy/useCopy'
import { CTA } from '@/feature/cta/CTA'

import { getToastSnapshot, subscribeToast, toast } from './toast.store'
import { TOAST_SLOT } from './toastSlot'

const Toaster = () => {
  const { t } = useCopy()
  const snapshot = useSyncExternalStore(subscribeToast, getToastSnapshot, getToastSnapshot)

  return (
    <ToastPrimitive.Provider
      label={t('common.toast.label')}
      swipeDirection="right"
    >
      {snapshot.shown.map((entry) => (
        <ToastPrimitive.Root
          key={`${entry.id}:${entry.revision}`}
          data-slot={TOAST_SLOT.root}
          data-severity={entry.severity}
          data-scope={entry.scope}
          type={entry.severity === 'danger' || entry.scope === 'required' ? 'foreground' : 'background'}
          open
          duration={entry.duration ?? Number.POSITIVE_INFINITY}
          onOpenChange={(open) => {
            if (!open && entry.scope !== 'required') toast.dismiss(entry.id)
          }}
          className="flex animate-fade-in items-start gap-3 rounded-md border border-stress-outline bg-base p-inset text-body2 text-stress shadow-lg focus-visible:focus-ring"
        >
          <SeverityIcon severity={entry.severity} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <ToastPrimitive.Title
              data-slot={TOAST_SLOT.title}
              className="text-subtitle2"
            >
              {entry.title}
            </ToastPrimitive.Title>
            {entry.description !== undefined && (
              <ToastPrimitive.Description data-slot={TOAST_SLOT.description}>
                {entry.description}
              </ToastPrimitive.Description>
            )}
          </div>
          {entry.cta !== undefined && (
            <ToastPrimitive.Action
              asChild
              altText={entry.cta.label}
            >
              <CTA
                data-slot={TOAST_SLOT.cta}
                variant="secondary"
                size="sm"
                onClick={() => {
                  entry.cta?.onPress()
                  toast.dismiss(entry.id)
                }}
              >
                {entry.cta.label}
              </CTA>
            </ToastPrimitive.Action>
          )}
          {entry.scope !== 'required' && (
            <ToastPrimitive.Close asChild>
              <CTA
                data-slot={TOAST_SLOT.dismissCTA}
                variant="tertiary"
                size="sm"
                iconOnly="close"
                aria-label={t('common.actions.dismiss')}
              />
            </ToastPrimitive.Close>
          )}
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport
        data-slot={TOAST_SLOT.viewport}
        label={t('common.toast.region')}
        className="fixed end-0 bottom-0 z-toast m-0 flex w-96 max-w-full list-none flex-col gap-2 p-gutter outline-none"
      />
    </ToastPrimitive.Provider>
  )
}

Toaster.displayName = 'Toaster'

export { Toaster }
