import type { ReactNode } from 'react'

import { useCopy } from '@/feature/copy/useCopy'
import { cn } from '@/style/cn'

import { SKELETON_SLOT } from './skeletonSlot'

type SkeletonProps = {
  children: ReactNode
  label?: string
}

type SkeletonTextProps = {
  lines?: number
}

type SkeletonBlockProps = {
  height: number
  width?: number
}

const SkeletonRoot = ({ children, label }: SkeletonProps) => {
  const { t } = useCopy()

  return (
    <output
      data-slot={SKELETON_SLOT.root}
      aria-label={label ?? t('common.loading')}
      className="block"
    >
      {children}
    </output>
  )
}

SkeletonRoot.displayName = 'Skeleton'

const SkeletonText = ({ lines = 1 }: SkeletonTextProps) => (
  <span
    data-slot={SKELETON_SLOT.text}
    aria-hidden="true"
    className="block"
  >
    {Array.from({ length: lines }, (_, index) => (
      <span
        key={index}
        data-slot={SKELETON_SLOT.line}
        className={cn(
          'block h-[1lh] animate-skeleton-pulse rounded-sm bg-stress-xs bg-clip-content py-[0.2lh]',
          lines > 1 && index === lines - 1 && 'w-3/5',
        )}
      />
    ))}
  </span>
)

SkeletonText.displayName = 'Skeleton.Text'

const SkeletonBlock = ({ height, width }: SkeletonBlockProps) => (
  <span
    data-slot={SKELETON_SLOT.block}
    aria-hidden="true"
    className="block max-w-full animate-skeleton-pulse rounded-md bg-stress-xs"
    style={{ height: `${height}rem`, width: width === undefined ? undefined : `${width}rem` }}
  />
)

SkeletonBlock.displayName = 'Skeleton.Block'

const Skeleton = Object.assign(SkeletonRoot, {
  Text: SkeletonText,
  Block: SkeletonBlock,
})

export { Skeleton }
export type { SkeletonBlockProps, SkeletonProps, SkeletonTextProps }
