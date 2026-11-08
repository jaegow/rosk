const FORM_SLOT = {
  root: 'form',
  section: 'form-section',
  sectionTitle: 'form-section-title',
  sectionGrid: 'form-section-grid',
  foot: 'form-foot',
  footMessage: 'form-foot-message',
} as const

const FORM_FIELD_SLOT = {
  root: 'form-field',
  label: 'form-field-label',
  requiredMarker: 'form-field-required-marker',
  box: 'form-field-box',
  control: 'form-field-control',
  clearCTA: 'form-field-clear-cta',
  message: 'form-field-message',
  option: 'form-field-option',
} as const

export { FORM_FIELD_SLOT, FORM_SLOT }
