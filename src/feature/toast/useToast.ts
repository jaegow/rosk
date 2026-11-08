import { useEffect, useRef } from 'react'

import { toast, type ToastInput } from './toast.store'

const useToast = () => {
  const ownedIds = useRef(new Set<string>())

  useEffect(() => {
    const owned = ownedIds.current
    return () => {
      owned.forEach((id) => toast.dismiss(id))
      owned.clear()
    }
  }, [])

  const show = (input: ToastInput): string => {
    const id = toast.show(input.scope === undefined ? { ...input, scope: 'component' } : input)
    if (input.scope === undefined || input.scope === 'component') ownedIds.current.add(id)
    else ownedIds.current.delete(id)
    return id
  }

  const dismiss = (id: string) => {
    ownedIds.current.delete(id)
    toast.dismiss(id)
  }

  return { show, dismiss }
}

export { useToast }
