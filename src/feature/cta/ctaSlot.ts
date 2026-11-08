const CTA_SLOT = {
  root: 'cta',
  label: 'cta-label',
  busy: 'cta-busy',
} as const

const CTA_BAR_SLOT = {
  root: 'cta-bar',
  cta: 'cta-bar-cta',
  tertiaryCTAs: 'cta-bar-tertiary-ctas',
  closingCTAs: 'cta-bar-closing-ctas',
} as const

export { CTA_BAR_SLOT, CTA_SLOT }
