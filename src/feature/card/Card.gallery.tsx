import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Card } from './Card'

const gallery: GalleryEntry = {
  title: 'Card',
  group: 'composites',
  examples: [
    {
      name: 'Head Status',
      render: () => (
        <div className="w-full max-w-sm">
          <Card>
            <Card.Head>
              <Card.Head.Title>Recent Notes</Card.Head.Title>
              <Card.Head.Status
                severity="warning"
                title="Notes could not sync"
                message="Changes made in the last hour may be missing."
              >
                <Card.Head.CTA>Retry Sync</Card.Head.CTA>
              </Card.Head.Status>
            </Card.Head>
            <Card.Content>Three notes</Card.Content>
          </Card>
        </div>
      ),
    },
    {
      name: 'Head, List and Foot',
      render: () => (
        <div className="w-full max-w-sm">
          <Card variant="raised">
            <Card.Head>
              <Card.Head.Title>Item Summary</Card.Head.Title>
              <Card.Head.Chip
                label="Open"
                status="info"
              />
              <Card.Head.CTAs>
                <Card.Head.CTA
                  iconOnly="edit"
                  aria-label="Edit Item Summary"
                />
              </Card.Head.CTAs>
              <Card.Head.Subtitle>Updated two days ago</Card.Head.Subtitle>
            </Card.Head>
            <Card.Content>
              <Card.Content.List>
                <Card.Content.List.Item label="Owner">Example Team</Card.Content.List.Item>
                <Card.Content.List.Item label="Due" />
                <Card.Content.List.Item label="Notes">4</Card.Content.List.Item>
                <Card.Content.List.CTA>Show All Notes</Card.Content.List.CTA>
              </Card.Content.List>
            </Card.Content>
            <Card.Foot>
              <Card.Foot.CTA lane="tertiary">Copy Link</Card.Foot.CTA>
              <Card.Foot.CTA lane="primary">Open Item</Card.Foot.CTA>
            </Card.Foot>
          </Card>
        </div>
      ),
    },
    {
      name: 'Sections',
      render: () => (
        <div className="w-full max-w-md">
          <Card>
            <Card.Head>
              <Card.Head.Title>Settings</Card.Head.Title>
            </Card.Head>
            <Card.Content>
              <Card.Section title="General">
                <Card.Content.List>
                  <Card.Content.List.Item label="Name">Example</Card.Content.List.Item>
                </Card.Content.List>
              </Card.Section>
              <Card.Section title="Sharing">
                <Card.Content.List>
                  <Card.Content.List.Item label="Visibility">Private</Card.Content.List.Item>
                </Card.Content.List>
              </Card.Section>
            </Card.Content>
          </Card>
        </div>
      ),
    },
    {
      name: 'Variants and Density',
      render: () => (
        <div className="grid w-full grid-cols-3 gap-4">
          <Card variant="outlined">
            <Card.Head>
              <Card.Head.Title>Outlined</Card.Head.Title>
            </Card.Head>
            <Card.Content>Sits in a form.</Card.Content>
          </Card>
          <Card variant="raised">
            <Card.Head>
              <Card.Head.Title>Raised</Card.Head.Title>
            </Card.Head>
            <Card.Content>Sits in a grid.</Card.Content>
          </Card>
          <Card
            variant="outlined"
            density="sm"
          >
            <Card.Head>
              <Card.Head.Title>Compact</Card.Head.Title>
            </Card.Head>
            <Card.Content>Small density.</Card.Content>
          </Card>
        </div>
      ),
    },
    {
      name: 'Loading and Indicator',
      render: () => (
        <div className="grid w-full grid-cols-2 gap-4">
          <Card loading>
            <Card.Head>
              <Card.Head.Title>Recent Notes</Card.Head.Title>
            </Card.Head>
            <Card.Content>Content stays while the read runs.</Card.Content>
          </Card>
          <Card indicator="warning">
            <Card.Head>
              <Card.Head.Title>Needs Review</Card.Head.Title>
            </Card.Head>
            <Card.Content>The card draws its own state line.</Card.Content>
          </Card>
        </div>
      ),
    },
  ],
}

export { gallery }
