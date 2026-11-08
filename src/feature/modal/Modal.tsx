import { Dialog } from 'radix-ui'
import { Children, isValidElement, type ReactNode, useRef } from 'react'

import { useCopy } from '@/feature/copy/useCopy'
import { CTA } from '@/feature/cta/CTA'
import type { CTAProps } from '@/feature/cta/cta.type'
import { LayoutContent, LayoutFoot, type LayoutFootProps, LayoutHead, type LayoutHeadProps, type LayoutHeadSubtitleProps, type LayoutHeadTitleProps } from '@/feature/layout/Layout'
import { HeadingLevelContext, LayoutFrameContext } from '@/feature/layout/layoutContext'
import { LeaveGuardContext } from '@/feature/route/leaveGuardContext'
import { cn } from '@/style/cn'

import { MODAL_SLOT } from './modalSlot'
import type { ModalControl } from './useModal'

type ModalSize = 'sm' | 'md' | 'lg'

type ModalVariant = 'dialog' | 'drawer-right'

type ModalProps = {
  control?: ModalControl
  size?: ModalSize
  variant?: ModalVariant
  children: ReactNode
}

type ModalContentProps = {
  children: ReactNode
}

const ModalTrigger = (props: CTAProps) => (
  <Dialog.Trigger asChild>
    <CTA {...props} />
  </Dialog.Trigger>
)

ModalTrigger.displayName = 'Modal.Trigger'

const ModalRoot = ({ control, size = 'md', variant = 'dialog', children }: ModalProps) => {
  const parts = Children.toArray(children)
  const focus = useRef<{ returnTo: HTMLElement | null }>({ returnTo: null })

  return (
    <Dialog.Root {...(control === undefined ? {} : { open: control.isOpen, onOpenChange: control.setOpen })}>
      {parts.filter((part) => isValidElement(part) && part.type === ModalTrigger)}
      <Dialog.Portal>
        <Dialog.Overlay
          data-slot={MODAL_SLOT.overlay}
          className={cn('fixed inset-0 animate-fade-in bg-backdrop/60 data-[state=closed]:animate-fade-out', ({
            'dialog': 'z-modal grid place-items-center overflow-y-auto p-4',
            'drawer-right': 'z-drawer flex justify-end',
          } satisfies Record<ModalVariant, string>)[variant])}
        >
          <Dialog.Content
            data-slot={MODAL_SLOT.root}
            data-modal-variant={variant}
            onOpenAutoFocus={() => {
              focus.current.returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null
            }}
            onCloseAutoFocus={(event) => {
              const returnTo = focus.current.returnTo
              focus.current.returnTo = null
              if (returnTo === null || !returnTo.isConnected) return
              event.preventDefault()
              returnTo.focus()
            }}
            className={cn(
              'flex w-full flex-col bg-base text-stress shadow-lg outline-none',
              ({
                'dialog': 'max-h-[90dvh] animate-modal-in rounded-lg data-[state=closed]:animate-modal-out',
                'drawer-right': 'h-full animate-fade-in data-[state=closed]:animate-fade-out',
              } satisfies Record<ModalVariant, string>)[variant],
              ({
                sm: 'max-w-sm',
                md: 'max-w-lg',
                lg: 'max-w-3xl',
              } satisfies Record<ModalSize, string>)[size],
            )}
          >
            <LayoutFrameContext.Provider value={{ variant: 'modal', inset: 'lg', titleLevel: 2 }}>
              <HeadingLevelContext.Provider value={3}>
                <LeaveGuardContext value={null}>
                  {parts.filter((part) => !(isValidElement(part) && part.type === ModalTrigger))}
                </LeaveGuardContext>
              </HeadingLevelContext.Provider>
            </LayoutFrameContext.Provider>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

ModalRoot.displayName = 'Modal'

const ModalHeadRoot = (props: LayoutHeadProps) => <LayoutHead {...props} />

ModalHeadRoot.displayName = 'Modal.Head'

const ModalHeadTitle = (props: LayoutHeadTitleProps) => (
  <Dialog.Title asChild>
    <LayoutHead.Title {...props} />
  </Dialog.Title>
)

ModalHeadTitle.displayName = 'Modal.Head.Title'

const ModalHeadSubtitle = (props: LayoutHeadSubtitleProps) => (
  <Dialog.Description asChild>
    <LayoutHead.Subtitle {...props} />
  </Dialog.Description>
)

ModalHeadSubtitle.displayName = 'Modal.Head.Subtitle'

const ModalContent = (props: ModalContentProps) => <LayoutContent {...props} />

ModalContent.displayName = 'Modal.Content'

const ModalFootRoot = (props: LayoutFootProps) => <LayoutFoot {...props} />

ModalFootRoot.displayName = 'Modal.Foot'

const ModalClose = () => {
  const { t } = useCopy()

  return (
    <Dialog.Close asChild>
      <CTA
        data-slot={MODAL_SLOT.closeCTA}
        variant="tertiary"
        size="sm"
        iconOnly="close"
        aria-label={t('common.actions.close')}
      />
    </Dialog.Close>
  )
}

ModalClose.displayName = 'Modal.Close'

const ModalHead = Object.assign(ModalHeadRoot, {
  Title: ModalHeadTitle,
  Subtitle: ModalHeadSubtitle,
  Chip: LayoutHead.Chip,
  CTAs: LayoutHead.CTAs,
  CTA: LayoutHead.CTA,
  Tabs: LayoutHead.Tabs,
  Status: LayoutHead.Status,
})

const ModalFoot = Object.assign(ModalFootRoot, {
  CTA: LayoutFoot.CTA,
})

const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Head: ModalHead,
  Content: ModalContent,
  Foot: ModalFoot,
  Close: ModalClose,
})

export { Modal }
export type { ModalContentProps, ModalProps, ModalSize, ModalVariant }
