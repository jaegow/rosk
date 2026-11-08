import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/testing/render.browser'

import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('announces one loading status and takes the height of the text lines it stands in for', async () => {
    const screen = await renderWithProviders(
      <div className="text-body1">
        <Skeleton>
          <Skeleton.Text lines={3} />
          <Skeleton.Block height={4} />
        </Skeleton>
      </div>,
    )
    const status = screen.getByRole('status', { name: 'Loading…' })

    await expect.element(status).toBeInTheDocument()
    expect(status.element().getBoundingClientRect().height).toBe(3 * 24 + 64)
  })
})
