import themeCss from '@/style/theme.css?raw'

import { parseThemeTokens } from './themeTokens.util'

const THEME_TOKENS = parseThemeTokens(themeCss)

export { THEME_TOKENS }
