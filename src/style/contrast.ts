type Rgb = { red: number, green: number, blue: number }

const WCAG_AA_TEXT = 4.5
const WCAG_AA_LARGE_TEXT = 3

const parseHex = (hex: string): Rgb => {
  const digits = hex.replace(/^#/, '')
  const full = digits.length === 3 ? [...digits].map((digit) => digit + digit).join('') : digits
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`not a hex colour: ${hex}`)
  return {
    red: Number.parseInt(full.slice(0, 2), 16),
    green: Number.parseInt(full.slice(2, 4), 16),
    blue: Number.parseInt(full.slice(4, 6), 16),
  }
}

const toHex = (color: Rgb): string => {
  const channel = (value: number) => Math.min(255, Math.max(0, Math.round(value))).toString(16).padStart(2, '0')
  return `#${channel(color.red)}${channel(color.green)}${channel(color.blue)}`.toUpperCase()
}

const composite = (top: string, alpha: number, bottom: string): string => {
  const over = parseHex(top)
  const under = parseHex(bottom)
  const blend = (upper: number, lower: number) => upper * alpha + lower * (1 - alpha)
  return toHex({
    red: blend(over.red, under.red),
    green: blend(over.green, under.green),
    blue: blend(over.blue, under.blue),
  })
}

const relativeLuminance = (hex: string): number => {
  const color = parseHex(hex)
  const linear = (value: number) => {
    const scaled = value / 255
    return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * linear(color.red) + 0.7152 * linear(color.green) + 0.0722 * linear(color.blue)
}

const contrastRatio = (first: string, second: string): number => {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second))
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second))
  return (lighter + 0.05) / (darker + 0.05)
}

const passesAA = (ink: string, surface: string): boolean => contrastRatio(ink, surface) >= WCAG_AA_TEXT

export { composite, contrastRatio, parseHex, passesAA, relativeLuminance, toHex, WCAG_AA_LARGE_TEXT, WCAG_AA_TEXT }
export type { Rgb }
