const remToPixel = (rem: number, rootFontSize: number = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)): number => rem * rootFontSize

export { remToPixel }
