import { Link } from 'react-router'

import { Card } from '@/feature/card/Card'
import { useCopy } from '@/feature/copy/useCopy'
import { Page } from '@/feature/page/Page'
import { useRoute } from '@/feature/route/useRoute'

const HomePage = () => {
  const { t } = useCopy()
  const route = useRoute()

  return (
    <Page>
      <Page.Head>
        <Page.Head.Title>{t('common.appName')}</Page.Head.Title>
        <Page.Head.Subtitle>{t('common.appTagline')}</Page.Head.Subtitle>
      </Page.Head>
      <Page.Content>
        <Page.Content.Grid>
          <Card variant="raised">
            <Card.Head>
              <Card.Head.Title>{t('common.nav.items')}</Card.Head.Title>
            </Card.Head>
            <Card.Content>{t('common.home.items.message')}</Card.Content>
            <Card.Foot>
              <Card.Foot.CTA
                lane="primary"
                asChild
              >
                <Link to={route.href('items')}>{t('common.nav.items')}</Link>
              </Card.Foot.CTA>
            </Card.Foot>
          </Card>
          <Card variant="raised">
            <Card.Head>
              <Card.Head.Title>{t('common.nav.gallery')}</Card.Head.Title>
            </Card.Head>
            <Card.Content>{t('common.home.gallery.message')}</Card.Content>
            <Card.Foot>
              <Card.Foot.CTA
                lane="primary"
                asChild
              >
                <Link to={route.href('gallery')}>{t('common.nav.gallery')}</Link>
              </Card.Foot.CTA>
            </Card.Foot>
          </Card>
        </Page.Content.Grid>
      </Page.Content>
    </Page>
  )
}

HomePage.displayName = 'HomePage'

export default HomePage
