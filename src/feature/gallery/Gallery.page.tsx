import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'

import { Card } from '@/feature/card/Card'
import { useCopy } from '@/feature/copy/useCopy'
import { Page } from '@/feature/page/Page'
import { useRoute } from '@/feature/route/useRoute'

import { GALLERY_SECTIONS } from './galleryEntries'
import { GalleryTokens } from './GalleryTokens'
import { THEME_TOKENS } from './themeTokens'

const GalleryPage = () => {
  const { t } = useCopy()
  const route = useRoute()
  const params = useParams()
  const opened = GALLERY_SECTIONS.flatMap((section) => section.listings).find((listing) => listing.slug === params.entry)
  const view = ((): 'tokens' | 'entry' | 'missing' | 'index' => {
    if (route.isActive('galleryTokens')) return 'tokens'
    if (opened !== undefined) return 'entry'
    return params.entry === undefined ? 'index' : 'missing'
  })()

  return (
    <Page>
      <Page.Head>
        <Page.Head.Title>
          {((): ReactNode => {
            switch (view) {
              case 'tokens': return t('common.gallery.tokens')
              case 'entry': return opened?.entry.title
              case 'missing': return t('common.notFound.title')
              case 'index': return t('common.nav.gallery')
            }
          })()}
        </Page.Head.Title>
        {view === 'index' && <Page.Head.Subtitle>{t('common.gallery.intro')}</Page.Head.Subtitle>}
        {view === 'missing' && <Page.Head.Subtitle>{t('common.notFound.message')}</Page.Head.Subtitle>}
        <Page.Head.CTAs>
          {view !== 'index' && (
            <Page.Head.CTA asChild>
              <Link to={route.href('gallery')}>{t('common.nav.gallery')}</Link>
            </Page.Head.CTA>
          )}
          {view !== 'tokens' && (
            <Page.Head.CTA asChild>
              <Link to={route.href('galleryTokens')}>{t('common.gallery.tokens')}</Link>
            </Page.Head.CTA>
          )}
        </Page.Head.CTAs>
      </Page.Head>
      <Page.Content>
        {((): ReactNode => {
          switch (view) {
            case 'tokens': return <GalleryTokens tokens={THEME_TOKENS} />
            case 'missing': return null
            case 'entry': return opened?.entry.examples.map((example) => (
              <Card key={example.name}>
                <Card.Head>
                  <Card.Head.Title>{example.name}</Card.Head.Title>
                </Card.Head>
                <Card.Content>
                  {/* DIVERGENCE: dx/page/layout: a specimen stage lays loose members out the way their caller would, so each renders standalone */}
                  <div className="relative flex flex-wrap items-start gap-3">
                    {example.render()}
                  </div>
                </Card.Content>
              </Card>
            ))
            case 'index': return (
              <Page.Content.Grid>
                {GALLERY_SECTIONS.map((section) => (
                  <Card key={section.group}>
                    <Card.Head>
                      <Card.Head.Title>
                        {((): string => {
                          switch (section.group) {
                            case 'primitives': return t('common.gallery.group.primitives')
                            case 'composites': return t('common.gallery.group.composites')
                            case 'form': return t('common.gallery.group.form')
                            case 'patterns': return t('common.gallery.group.patterns')
                          }
                        })()}
                      </Card.Head.Title>
                    </Card.Head>
                    <Card.Content>
                      <Card.Content.List>
                        {section.listings.map((listing) => (
                          <Card.Content.List.CTA
                            key={listing.slug}
                            asChild
                          >
                            <Link to={route.href('galleryEntry', { entry: listing.slug })}>{listing.entry.title}</Link>
                          </Card.Content.List.CTA>
                        ))}
                      </Card.Content.List>
                    </Card.Content>
                  </Card>
                ))}
              </Page.Content.Grid>
            )
          }
        })()}
      </Page.Content>
    </Page>
  )
}

GalleryPage.displayName = 'GalleryPage'

export default GalleryPage
