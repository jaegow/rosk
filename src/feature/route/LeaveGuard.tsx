import { type ReactNode, useRef, useState } from 'react'
import { useBeforeUnload, useBlocker } from 'react-router'

import { useCopy } from '@/feature/copy/useCopy'
import { Modal } from '@/feature/modal/Modal'

import { LeaveGuardContext, type LeaveGuardSource } from './leaveGuardContext'

type LeaveGuardProviderProps = {
  children: ReactNode
}

const LeaveGuardProvider = ({ children }: LeaveGuardProviderProps) => {
  const { t } = useCopy()
  const sources = useRef(new Set<LeaveGuardSource>())
  const [pendingDiscard, setPendingDiscard] = useState<(() => void) | null>(null)
  const blocker = useBlocker(({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname
    && [...sources.current].some((source) => source.dirty))

  useBeforeUnload((event) => {
    if ([...sources.current].some((source) => source.dirty)) event.preventDefault()
  })

  const stay = () => {
    setPendingDiscard(null)
    blocker.reset?.()
  }

  return (
    <LeaveGuardContext
      value={{
        register: (source) => {
          sources.current.add(source)
          return () => {
            sources.current.delete(source)
          }
        },
        confirmDiscard: (discard) => setPendingDiscard(() => discard),
      }}
    >
      {children}
      <Modal
        size="sm"
        control={{
          isOpen: blocker.state === 'blocked' || pendingDiscard !== null,
          setOpen: (next) => {
            if (next === false) stay()
          },
          open: () => undefined,
          close: stay,
        }}
      >
        <Modal.Head>
          <Modal.Head.Title>{t('common.leaveGuard.title')}</Modal.Head.Title>
        </Modal.Head>
        <Modal.Content>{t('common.leaveGuard.message')}</Modal.Content>
        <Modal.Foot>
          <Modal.Foot.CTA
            lane="secondary"
            onClick={stay}
          >
            {t('common.leaveGuard.stay')}
          </Modal.Foot.CTA>
          <Modal.Foot.CTA
            lane="primary"
            onClick={() => {
              if (pendingDiscard === null) {
                blocker.proceed?.()
                return
              }
              setPendingDiscard(null)
              pendingDiscard()
            }}
          >
            {t('common.leaveGuard.leave')}
          </Modal.Foot.CTA>
        </Modal.Foot>
      </Modal>
    </LeaveGuardContext>
  )
}

LeaveGuardProvider.displayName = 'LeaveGuardProvider'

export { LeaveGuardProvider }
export type { LeaveGuardProviderProps }
