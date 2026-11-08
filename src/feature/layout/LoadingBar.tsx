import { useContext, useEffect, useState } from 'react'

import { useCopy } from '@/feature/copy/useCopy'

import { LayoutFrameContext } from './layoutContext'
import { layoutSlot } from './layoutSlot'

const LoadingBar = () => {
  const { t } = useCopy()
  const frame = useContext(LayoutFrameContext)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), import.meta.env.MODE === 'test' ? 0 : 400)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <output
      data-slot={layoutSlot(frame.variant, 'loadingBar')}
      aria-label={t('common.loading')}
      className="pointer-events-none absolute inset-x-0 top-0 block h-0.5 overflow-clip"
    >
      {revealed && <span className="block h-full w-1/3 animate-loading-bar bg-brand" />}
    </output>
  )
}

LoadingBar.displayName = 'LoadingBar'

export { LoadingBar }
