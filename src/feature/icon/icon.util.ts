const CIRCLE = 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z'

const ICON_PATHS = {
  'check': ['M5 12.5l4.5 4.5L19 7'],
  'close': ['M6 6l12 12', 'M18 6L6 18'],
  'chevron-down': ['M6 9l6 6 6-6'],
  'chevron-up': ['M6 15l6-6 6 6'],
  'chevron-left': ['M15 6l-6 6 6 6'],
  'chevron-right': ['M9 6l6 6-6 6'],
  'plus': ['M12 5v14', 'M5 12h14'],
  'minus': ['M5 12h14'],
  'search': ['M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14z', 'M20 20l-4-4'],
  'info': [CIRCLE, 'M12 11v5', 'M12 7.5v.01'],
  'warning': ['M12 3.5L2.5 20h19z', 'M12 10v4', 'M12 17v.01'],
  'error': [CIRCLE, 'M9 9l6 6', 'M15 9l-6 6'],
  'success': [CIRCLE, 'M8 12.5l3 3 5-6'],
  'more-horizontal': ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'],
  'menu': ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  'external': ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
  'copy': ['M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z', 'M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1'],
  'edit': ['M4 20h4L19 9l-4-4L4 16z', 'M13 7l4 4'],
  'trash': ['M4 7h16', 'M10 11v6', 'M14 11v6', 'M6 7l1 13h10l1-13', 'M9 7V4h6v3'],
  'arrow-left': ['M19 12H5', 'M11 6l-6 6 6 6'],
  'arrow-right': ['M5 12h14', 'M13 6l6 6-6 6'],
  'sun': ['M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z', 'M12 2v2', 'M12 20v2', 'M4.9 4.9l1.4 1.4', 'M17.7 17.7l1.4 1.4', 'M2 12h2', 'M20 12h2', 'M4.9 19.1l1.4-1.4', 'M17.7 6.3l1.4-1.4'],
  'moon': ['M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z'],
  'calendar': ['M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M4 10h16', 'M8 3v4', 'M16 3v4'],
  'filter': ['M4 5h16l-6 8v6l-4-2v-4z'],
  'sort': ['M7 4v16', 'M3 8l4-4 4 4', 'M17 20V4', 'M13 16l4 4 4-4'],
  'eye': ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z', 'M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z'],
  'eye-off': ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z', 'M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z', 'M4 4l16 16'],
  'upload': ['M12 15V4', 'M7 9l5-5 5 5', 'M5 20h14'],
  'download': ['M12 4v11', 'M7 10l5 5 5-5', 'M5 20h14'],
  'user': ['M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8z', 'M4 20a8 8 0 0 1 16 0'],
  'settings': ['M4 7h9', 'M17 7h3', 'M15 5v4', 'M4 12h3', 'M11 12h9', 'M9 10v4', 'M4 17h11', 'M19 17h1', 'M17 15v4'],
  'home': ['M4 11l8-7 8 7', 'M6 9.5V20h12V9.5', 'M10 20v-5h4v5'],
} as const satisfies Record<string, readonly string[]>

type IconName = keyof typeof ICON_PATHS

export { ICON_PATHS }
export type { IconName }
