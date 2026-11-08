import { Card } from '@/feature/card/Card'
import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Page } from './Page'

const gallery: GalleryEntry = {
  title: 'Page',
  group: 'composites',
  examples: [
    {
      name: 'Head, Card Grid and Foot',
      render: () => (
        <div className="w-full rounded-lg border border-stress-outline">
          <Page read={{ status: 'success' }}>
            <Page.Head>
              <Page.Head.Title>Items</Page.Head.Title>
              <Page.Head.Chip
                label="Draft"
                status="neutral"
              />
              <Page.Head.Subtitle>Everything in the example workspace.</Page.Head.Subtitle>
            </Page.Head>
            <Page.Content>
              <Page.Content.Grid>
                <Card variant="raised">
                  <Card.Head>
                    <Card.Head.Title>Open</Card.Head.Title>
                  </Card.Head>
                  <Card.Content>12</Card.Content>
                </Card>
                <Card variant="raised">
                  <Card.Head>
                    <Card.Head.Title>Closed</Card.Head.Title>
                  </Card.Head>
                  <Card.Content>30</Card.Content>
                </Card>
              </Page.Content.Grid>
            </Page.Content>
            <Page.Foot>
              <Page.Foot.CTA lane="tertiary">Export</Page.Foot.CTA>
              <Page.Foot.CTA lane="primary">New Item</Page.Foot.CTA>
            </Page.Foot>
          </Page>
        </div>
      ),
    },
    {
      name: 'Loading',
      render: () => (
        <div className="w-full rounded-lg border border-stress-outline">
          <Page read={{ status: 'pending' }}>
            <Page.Head>
              <Page.Head.Title>Items</Page.Head.Title>
            </Page.Head>
            <Page.Content>
              <p className="text-body2 text-stress-xxl">The page stays on screen while its read runs.</p>
            </Page.Content>
          </Page>
        </div>
      ),
    },
    {
      name: 'Failed Read',
      render: () => (
        <div className="w-full rounded-lg border border-stress-outline">
          <Page read={{ status: 'error', refetch: () => undefined }}>
            <Page.Head>
              <Page.Head.Title>Items</Page.Head.Title>
            </Page.Head>
            <Page.Content>
              <p>Never shown</p>
            </Page.Content>
          </Page>
        </div>
      ),
    },
    {
      name: 'Denied',
      render: () => (
        <div className="w-full rounded-lg border border-stress-outline">
          <Page access="denied">
            <Page.Head>
              <Page.Head.Title>Items</Page.Head.Title>
            </Page.Head>
            <Page.Content>
              <p>Never shown</p>
            </Page.Content>
          </Page>
        </div>
      ),
    },
  ],
}

export { gallery }
