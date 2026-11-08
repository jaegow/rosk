import { type ReactNode, useContext } from 'react'

import { useCopy } from '@/feature/copy/useCopy'
import { EmptyState } from '@/feature/empty-state/EmptyState'
import { LayoutContent, LayoutFoot, type LayoutFootProps, LayoutHead, type LayoutHeadProps } from '@/feature/layout/Layout'
import type { HeadingLevel } from '@/feature/layout/layout.type'
import { nextHeadingLevel } from '@/feature/layout/layout.util'
import { HeadingLevelContext, LayoutFrameContext } from '@/feature/layout/layoutContext'
import { cn } from '@/style/cn'

import type { PageAccess, PageContentLayout, PageRead } from './page.type'
import { combineReads, ownsChrome, pageGateState } from './page.util'
import { PageGateContext, PageNestedContext } from './pageContext'
import { PAGE_SLOT } from './pageSlot'

type PageProps = {
  access?: PageAccess
  read?: PageRead | readonly PageRead[]
  empty?: boolean
  children: ReactNode
}

type PageContentProps = {
  layout?: PageContentLayout
  children: ReactNode
}

type PageContentGridProps = {
  children: ReactNode
}

const PageRoot = ({ access, read, empty, children }: PageProps) => {
  const combined = combineReads(read)
  const state = pageGateState({ access, read: combined, empty })
  const nested = useContext(PageNestedContext)
  const enclosingLevel = useContext(HeadingLevelContext)
  const titleLevel: HeadingLevel = nested ? enclosingLevel : 1
  const Landmark = nested ? 'div' : 'main'

  return (
    <PageNestedContext.Provider value>
      <PageGateContext.Provider value={{ state, retry: combined?.refetch }}>
        <LayoutFrameContext.Provider value={{ variant: 'page', inset: 'lg', titleLevel, loading: state === 'loading' || state === 'resolving' }}>
          <HeadingLevelContext.Provider value={nextHeadingLevel(titleLevel)}>
            <Landmark
              data-slot={PAGE_SLOT.root}
              data-gate-state={state}
              aria-busy={state === 'loading' || state === 'resolving' || undefined}
              className="flex min-h-full min-w-0 flex-col text-stress"
            >
              {children}
            </Landmark>
          </HeadingLevelContext.Provider>
        </LayoutFrameContext.Provider>
      </PageGateContext.Provider>
    </PageNestedContext.Provider>
  )
}

PageRoot.displayName = 'Page'

const PageHeadRoot = (props: LayoutHeadProps) => {
  const gate = useContext(PageGateContext)
  return ownsChrome(gate.state) ? <LayoutHead {...props} /> : null
}

PageHeadRoot.displayName = 'Page.Head'

const PageContentRoot = ({ layout = 'flow', children }: PageContentProps) => {
  const { t } = useCopy()
  const gate = useContext(PageGateContext)
  const frame = useContext(LayoutFrameContext)

  return (
    <LayoutContent>
      <div
        data-slot={PAGE_SLOT.contentLayout}
        data-layout={layout}
        className={cn('grid min-w-0', ({
          'flow': 'content-start gap-gutter',
          'fill': 'h-full min-h-0 grid-rows-[minmax(0,1fr)]',
          '2-up': 'grid-cols-2 items-start gap-gutter',
        } satisfies Record<PageContentLayout, string>)[layout])}
      >
        {((): ReactNode => {
          switch (gate.state) {
            case 'resolving': return null
            case 'denied': return (
              <HeadingLevelContext.Provider value={frame.titleLevel}>
                <EmptyState
                  icon="eye-off"
                  title={t('common.page.denied.title')}
                  message={t('common.page.denied.message')}
                />
              </HeadingLevelContext.Provider>
            )
            case 'failed': return (
              <EmptyState
                icon="error"
                title={t('common.page.failed.title')}
                message={t('common.page.failed.message')}
              >
                {gate.retry !== undefined && (
                  <EmptyState.CTA onClick={() => gate.retry?.()}>{t('common.actions.retry')}</EmptyState.CTA>
                )}
              </EmptyState>
            )
            case 'empty': return (
              <EmptyState
                title={t('common.page.empty.title')}
                message={t('common.page.empty.message')}
              />
            )
            case 'loading': return children
            case 'ready': return children
          }
        })()}
      </div>
    </LayoutContent>
  )
}

PageContentRoot.displayName = 'Page.Content'

const PageContentGrid = ({ children }: PageContentGridProps) => (
  <div
    data-slot={PAGE_SLOT.contentGrid}
    className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] items-start gap-gutter"
  >
    {children}
  </div>
)

PageContentGrid.displayName = 'Page.Content.Grid'

const PageFootRoot = (props: LayoutFootProps) => {
  const gate = useContext(PageGateContext)
  return ownsChrome(gate.state) ? <LayoutFoot {...props} /> : null
}

PageFootRoot.displayName = 'Page.Foot'

const PageHead = Object.assign(PageHeadRoot, {
  Title: LayoutHead.Title,
  Subtitle: LayoutHead.Subtitle,
  Chip: LayoutHead.Chip,
  CTAs: LayoutHead.CTAs,
  CTA: LayoutHead.CTA,
  Tabs: LayoutHead.Tabs,
  Status: LayoutHead.Status,
})

const PageContent = Object.assign(PageContentRoot, {
  Grid: PageContentGrid,
})

const PageFoot = Object.assign(PageFootRoot, {
  CTA: LayoutFoot.CTA,
})

const Page = Object.assign(PageRoot, {
  Head: PageHead,
  Content: PageContent,
  Foot: PageFoot,
})

export { Page }
export type { PageContentGridProps, PageContentProps, PageProps }
