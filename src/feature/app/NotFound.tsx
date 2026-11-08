import { Link } from 'react-router'

import { useCopy } from '@/feature/copy/useCopy'
import { Page } from '@/feature/page/Page'
import { hrefFor } from '@/feature/route/sitemap'

const NotFound = () => {
  const { t } = useCopy()

  return (
    <Page>
      <Page.Head>
        <Page.Head.Title>{t('common.notFound.title')}</Page.Head.Title>
        <Page.Head.Subtitle>{t('common.notFound.message')}</Page.Head.Subtitle>
        <Page.Head.CTAs>
          <Page.Head.CTA asChild>
            <Link to={hrefFor('home')}>{t('common.nav.home')}</Link>
          </Page.Head.CTA>
        </Page.Head.CTAs>
      </Page.Head>
    </Page>
  )
}

NotFound.displayName = 'NotFound'

export { NotFound }
