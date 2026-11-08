import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/testing/render.browser'

import { Divider } from './Divider'

describe('Divider', () => {
  it('runs the full height of its row when vertical and stops an inset short of each edge when inset', async () => {
    const screen = await renderWithProviders(
      <>
        <div
          data-testid="row"
          className="flex h-12 items-center"
        >
          <span>Left</span>
          <Divider orientation="vertical" />
          <span>Right</span>
        </div>
        <div
          data-testid="column"
          style={{ width: '20rem' }}
        >
          <Divider inset />
        </div>
      </>,
    )
    const [vertical, horizontal] = screen.getByRole('separator').elements()
    const row = screen.getByTestId('row').element().getBoundingClientRect()
    const column = screen.getByTestId('column').element().getBoundingClientRect()

    expect(vertical).toHaveAttribute('aria-orientation', 'vertical')
    expect(vertical?.getBoundingClientRect().height).toBe(row.height)
    expect(horizontal?.getBoundingClientRect().width).toBe(column.width - 32)
  })
})
