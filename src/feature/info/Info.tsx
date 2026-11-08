import { type ReactNode, useState } from 'react'

import { Icon } from '@/feature/icon/Icon'
import { Tooltip } from '@/feature/tooltip/Tooltip'

import { INFO_SLOT } from './infoSlot'

type InfoProps = {
  label: string
  children: ReactNode
}

const Info = ({ label, children }: InfoProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Tooltip
      open={open}
      onOpenChange={setOpen}
    >
      <Tooltip.Trigger asChild>
        <button
          type="button"
          data-slot={INFO_SLOT.root}
          aria-label={label}
          className="inline-flex size-5 shrink-0 cursor-help items-center justify-center rounded-full text-stress-xl hover:text-stress focus-visible:focus-ring"
          onClick={(event) => {
            event.preventDefault()
            setOpen(true)
          }}
        >
          <Icon
            name="info"
            size="sm"
          />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content>{children}</Tooltip.Content>
    </Tooltip>
  )
}

Info.displayName = 'Info'

export { Info }
export type { InfoProps }
