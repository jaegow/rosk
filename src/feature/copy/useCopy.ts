import { useTranslation } from 'react-i18next'

const useCopy = () => {
  const translation = useTranslation()
  return { t: translation.t }
}

export { useCopy }
