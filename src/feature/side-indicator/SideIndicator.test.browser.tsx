import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/testing/render.browser'

import { SideIndicator } from './SideIndicator'

describe('SideIndicator', () => {
  it('draws a line down its host\'s start edge without taking width, and none inside a host that draws its own', async () => {
    const screen = await renderWithProviders(
      <div
        data-testid="host"
        className="relative w-fit"
      >
        <SideIndicator variant="warning" />
        <SideIndicator.Enclosing>
          <div
            data-testid="row"
            className="relative"
            style={{ width: '10rem', height: '2rem' }}
          >
            <SideIndicator variant="danger" />
          </div>
        </SideIndicator.Enclosing>
      </div>,
    )
    const host = screen.getByTestId('host').element()
    const line = host.firstElementChild
    const hostBox = host.getBoundingClientRect()
    const lineBox = line?.getBoundingClientRect()

    expect(line).toHaveAttribute('aria-hidden', 'true')
    expect(hostBox.width).toBe(160)
    expect(lineBox?.left).toBe(hostBox.left)
    expect(lineBox?.height).toBe(hostBox.height)
    expect(screen.getByTestId('row').element().childElementCount).toBe(0)
  })
})
