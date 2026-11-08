import './theme.css'

import { afterEach, describe, expect, it } from 'vitest'
import { cdp } from 'vitest/browser'
import { render } from 'vitest-browser-react'

import { applyThemeMode } from './useThemeMode'

const rasterize = (...layers: string[]): number[] => {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext('2d')
  if (context === null) throw new Error('no 2d canvas context')
  for (const layer of layers) {
    context.fillStyle = layer
    context.fillRect(0, 0, 1, 1)
  }
  return [...context.getImageData(0, 0, 1, 1).data]
}

const resolveColor = (expression: string): string => {
  const probe = document.createElement('div')
  probe.style.color = expression
  document.body.append(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  return resolved
}

const renderSwatches = () => render(
  <div>
    <span
      data-testid="surface"
      className="bg-base text-stress"
    >
      x
    </span>
    <span
      data-testid="brand"
      className="text-brand"
    >
      x
    </span>
  </div>,
)

const readSwatches = (screen: Awaited<ReturnType<typeof renderSwatches>>) => {
  const style = (testId: string) => getComputedStyle(screen.getByTestId(testId).element())
  return {
    base: rasterize(style('surface').backgroundColor),
    stress: rasterize(style('surface').color),
    brand: rasterize(style('brand').color),
  }
}

const setSystemScheme = (scheme: 'light' | 'dark') =>
  cdp().send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] })

afterEach(async () => {
  applyThemeMode('system')
  await setSystemScheme('light')
})

describe('theme modes', () => {
  it('paints the light palette by default', async () => {
    const swatches = readSwatches(await renderSwatches())
    expect(swatches.base).toEqual([255, 255, 255, 255])
    expect(swatches.stress).toEqual([20, 22, 28, 255])
    expect(swatches.brand).toEqual([58, 68, 166, 255])
  })

  it('switches every swapped token when the root is set to dark', async () => {
    const screen = await renderSwatches()
    const light = readSwatches(screen)

    applyThemeMode('dark')
    const dark = readSwatches(screen)

    expect(dark.base).toEqual([18, 19, 24, 255])
    expect(dark.stress).toEqual([244, 245, 248, 255])
    expect(dark.brand).toEqual([169, 177, 255, 255])
    expect(dark.base).not.toEqual(light.base)
  })

  it('follows a dark system preference unless the root pins light', async () => {
    const screen = await renderSwatches()

    await setSystemScheme('dark')
    expect(readSwatches(screen).base).toEqual([18, 19, 24, 255])

    applyThemeMode('light')
    expect(readSwatches(screen).base).toEqual([255, 255, 255, 255])
  })

  it.each(['light', 'dark'] as const)('paints each hue tint as the hue under stress-xl-inverse in %s mode', (mode) => {
    applyThemeMode(mode)
    for (const hue of ['info', 'success', 'warning', 'danger']) {
      const tint = rasterize(resolveColor(`var(--color-${hue}-tint)`))
      const layered = rasterize(resolveColor(`var(--color-${hue})`), resolveColor('var(--color-stress-xl-inverse)'))
      tint.forEach((channel, index) => expect(Math.abs(channel - (layered[index] ?? 0))).toBeLessThanOrEqual(1))
    }
  })

  it.each([['light', 'dark'], ['dark', 'light']] as const)('paints a nested %s-page frame set to %s with that mode\'s tokens', async (page, frame) => {
    applyThemeMode(page)
    const screen = await render(
      <div>
        <span data-testid="outside" className="bg-base text-stress dark:text-brand" />
        <div data-theme={frame}>
          <span data-testid="inside" className="bg-base text-stress dark:text-brand" />
          <span data-testid="rung" className="bg-stress-xs" />
        </div>
      </div>,
    )
    const style = (testId: string) => getComputedStyle(screen.getByTestId(testId).element())
    const palette = { light: { base: [255, 255, 255, 255], ink: [20, 22, 28, 255] }, dark: { base: [18, 19, 24, 255], ink: [169, 177, 255, 255] } }

    expect(rasterize(style('outside').backgroundColor)).toEqual(palette[page].base)
    expect(rasterize(style('outside').color)).toEqual(palette[page].ink)
    expect(rasterize(style('inside').backgroundColor)).toEqual(palette[frame].base)
    expect(rasterize(style('inside').color)).toEqual(palette[frame].ink)
    const frameBase = style('inside').backgroundColor
    expect(rasterize(frameBase, style('rung').backgroundColor)).not.toEqual(rasterize(frameBase, resolveColor('var(--color-stress-xs)')))
  })

  it('derives the stress ladder from the active mode', () => {
    const lightRung = rasterize(resolveColor('var(--color-base)'), resolveColor('var(--color-stress-xs)'))
    applyThemeMode('dark')
    const darkRung = rasterize(resolveColor('var(--color-base)'), resolveColor('var(--color-stress-xs)'))
    expect(lightRung).not.toEqual(darkRung)
    expect((darkRung[0] ?? 0)).toBeGreaterThan(18)
    expect((lightRung[0] ?? 255)).toBeLessThan(255)
  })
})
