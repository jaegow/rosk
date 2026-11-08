import { within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/testing/render.unit'

import { Card } from './Card'

describe('Card', () => {
  it('names itself by its title and steps nested section and card headings down a level', () => {
    const view = renderWithProviders(
      <Card>
        <Card.Head>
          <Card.Head.Title>Item Details</Card.Head.Title>
        </Card.Head>
        <Card.Content>
          <Card.Section title="Owner">
            <Card>
              <Card.Head>
                <Card.Head.Title>Contact</Card.Head.Title>
              </Card.Head>
            </Card>
          </Card.Section>
        </Card.Content>
      </Card>,
    )

    expect(view.getByRole('region', { name: 'Item Details' })).toBeInTheDocument()
    expect(view.getByRole('heading', { level: 2, name: 'Item Details' })).toBeInTheDocument()
    expect(view.getByRole('heading', { level: 3, name: 'Owner' })).toBeInTheDocument()
    expect(view.getByRole('heading', { level: 4, name: 'Contact' })).toBeInTheDocument()
  })

  it('lists values as labelled rows, shows the em dash for an absent value, and runs its list CTA', async () => {
    const user = userEvent.setup()
    const onShowAll = vi.fn()
    const view = renderWithProviders(
      <Card>
        <Card.Content>
          <Card.Content.List>
            <Card.Content.List.Item label="Status">Open</Card.Content.List.Item>
            <Card.Content.List.Item label="Due" />
            <Card.Content.List.CTA onClick={() => onShowAll()}>Show All Notes</Card.Content.List.CTA>
          </Card.Content.List>
        </Card.Content>
      </Card>,
    )

    const rows = within(view.getByRole('list')).getAllByRole('listitem')
    expect(rows.map((row) => row.textContent)).toEqual(['StatusOpen', 'Due—', 'Show All Notes'])

    await user.click(view.getByRole('button', { name: 'Show All Notes' }))
    expect(onShowAll).toHaveBeenCalledWith()
  })

  it('ranks foot CTAs into lanes whatever order they are written in, never painting primary', () => {
    const view = renderWithProviders(
      <Card>
        <Card.Foot>
          <Card.Foot.CTA lane="primary">Open Item</Card.Foot.CTA>
          <Card.Foot.CTA
            lane="tertiary"
            variant="danger"
          >
            Remove
          </Card.Foot.CTA>
          <Card.Foot.CTA lane="secondary">Copy Link</Card.Foot.CTA>
        </Card.Foot>
      </Card>,
    )

    const ctas = view.getAllByRole('button')
    expect(ctas.map((cta) => cta.textContent)).toEqual(['Remove', 'Copy Link', 'Open Item'])
    expect(ctas.map((cta) => cta.dataset.ctaVariant)).toEqual(['danger', 'secondary', 'secondary'])
  })

  it('reports busy and a loading status while loading, keeping its content', () => {
    const view = renderWithProviders(
      <Card loading>
        <Card.Head>
          <Card.Head.Title>Recent Notes</Card.Head.Title>
        </Card.Head>
        <Card.Content>Three notes</Card.Content>
      </Card>,
    )

    expect(view.getByRole('region', { name: 'Recent Notes' })).toHaveAttribute('aria-busy', 'true')
    expect(view.getByRole('status', { name: 'Loading…' })).toBeInTheDocument()
    expect(view.getByText('Three notes')).toBeInTheDocument()
  })

  it('hosts its head statuses as one band showing the most urgent, after every other head part', () => {
    const view = renderWithProviders(
      <Card>
        <Card.Head>
          <Card.Head.Status
            severity="info"
            message="Synced an hour ago"
          />
          <Card.Head.Title>Recent Notes</Card.Head.Title>
          <Card.Head.Status
            severity="danger"
            title="Notes could not sync"
          >
            <Card.Head.CTA>Retry Sync</Card.Head.CTA>
          </Card.Head.Status>
        </Card.Head>
      </Card>,
    )

    const head = view.getByRole('heading', { name: 'Recent Notes' }).parentElement
    expect(head?.lastElementChild).toHaveTextContent('Notes could not syncRetry Sync')
    expect(view.queryByText('Synced an hour ago')).not.toBeInTheDocument()
  })
})
