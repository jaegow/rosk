import { useState } from 'react'

const useModal = (initialOpen = false) => {
  const [isOpen, setOpen] = useState(initialOpen)

  return {
    isOpen,
    setOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
  }
}

type ModalControl = ReturnType<typeof useModal>

export { useModal }
export type { ModalControl }
