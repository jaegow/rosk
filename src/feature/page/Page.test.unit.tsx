import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/testing/render.unit'

import { Page } from './Page'
import type { PageAccess, PageRead } from './page.type'

const ItemsPage = ({ access, read, empty }: { access?: PageAccess, read?: PageRead, empty?: boolean }) => (
  <Page
    access={access}
    read={read}
    empty={empty}
  >
    <Page.Head>
      <Page.Head.Title>Items</Page.Head.Title>
      <Page.Head.CTAs>
        <Page.Head.CTA>Export</Page.Head.CTA>
      </Page.Head.CTAs>
    </Page.Head>
    <Page.Content>
      <p>Item list</p>
    </Page.Content>
    <Page.Foot>
      <Page.Foot.CTA lane="primary">New Item</Page.Foot.CTA>
    </Page.Foot>
  </Page>
)

describe('Page gate', () => {
  it('renders the head, content and foot when ready', () => {
    const view = renderWithProviders(<ItemsPage read={{ status: 'success' }} />)

    expect(view.getByRole('heading', { level: 1, name: 'Items' })).toBeInTheDocument()
    expect(view.getByText('Item list')).toBeInTheDocument()
    expect(view.getByRole('button', { name: 'New Item' })).toHaveAttribute('data-cta-variant', 'primary')
  })

  it('keeps the page on screen while its read is pending and reports the wait', () => {
    const view = renderWithProviders(<ItemsPage read={{ status: 'pending' }} />)

    expect(view.getByRole('main')).toHaveAttribute('aria-busy', 'true')
    expect(view.getByRole('status', { name: 'Loading…' })).toBeInTheDocument()
    expect(view.getByRole('heading', { level: 1, name: 'Items' })).toBeInTheDocument()
    expect(view.getByText('Item list')).toBeInTheDocument()
  })

  it('shows nothing the page owns while access resolves', () => {
    const view = renderWithProviders(<ItemsPage access="resolving" />)

    expect(view.getByRole('status', { name: 'Loading…' })).toBeInTheDocument()
    expect(view.queryByRole('heading', { name: 'Items' })).toBeNull()
    expect(view.queryByText('Item list')).toBeNull()
    expect(view.queryByRole('button')).toBeNull()
  })

  it('renders a denial as the page heading in place of everything the page owns', () => {
    const view = renderWithProviders(<ItemsPage access="denied" />)

    expect(view.getByRole('heading', { level: 1, name: 'You Can\'t View This Page' })).toBeInTheDocument()
    expect(view.getByText('Someone who manages access can give it to you.')).toBeInTheDocument()
    expect(view.queryByText('Item list')).toBeNull()
    expect(view.queryByRole('button', { name: 'New Item' })).toBeNull()
  })

  it('replaces the content with a failed state that retries the read', async () => {
    const user = userEvent.setup()
    const refetch = vi.fn()
    const view = renderWithProviders(<ItemsPage read={{ status: 'error', error: new Error('offline'), refetch }} />)

    expect(view.getByRole('heading', { level: 1, name: 'Items' })).toBeInTheDocument()
    expect(view.getByRole('heading', { level: 2, name: 'This Page Could Not Load' })).toBeInTheDocument()
    expect(view.queryByText('Item list')).toBeNull()

    await user.click(view.getByRole('button', { name: 'Try Again' }))
    expect(refetch).toHaveBeenCalledWith()
  })

  it('says there is nothing yet once the read answers empty', () => {
    const view = renderWithProviders(
      <ItemsPage
        read={{ status: 'success' }}
        empty
      />,
    )

    expect(view.getByRole('heading', { level: 2, name: 'Nothing Here Yet' })).toBeInTheDocument()
    expect(view.queryByText('Item list')).toBeNull()
  })

  it('renders one main landmark and one top heading when a page sits inside another', () => {
    const view = renderWithProviders(
      <Page>
        <Page.Head>
          <Page.Head.Title>Gallery</Page.Head.Title>
        </Page.Head>
        <Page.Content>
          <ItemsPage read={{ status: 'success' }} />
        </Page.Content>
      </Page>,
    )

    expect(view.getAllByRole('main')).toHaveLength(1)
    expect(view.getAllByRole('heading', { level: 1 }).map((heading) => heading.textContent)).toEqual(['Gallery'])
    expect(view.getByRole('heading', { level: 2, name: 'Items' })).toBeInTheDocument()
  })
})
