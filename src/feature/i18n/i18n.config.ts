import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './en.json'

const i18n = i18next.createInstance()

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: 'en',
  fallbackLng: 'en',
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  initAsync: false,
})

export { i18n }
