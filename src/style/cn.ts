import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const TYPOGRAPHY_SCALE = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'body3', 'caption']

const NAMED_SPACING = ['gutter', 'inset']

const MOTION = ['fade-in', 'fade-out', 'modal-in', 'modal-out', 'skeleton-pulse', 'spinner', 'collapsible-open', 'collapsible-close', 'loading-bar']

const LAYER_CLASSES = ['z-drawer', 'z-modal', 'z-popover', 'z-dropdown', 'z-toast', 'z-tooltip']

const STRESS_OVERLAY_CLASSES = [
  'stress',
  'stress-xs', 'stress-sm', 'stress-md', 'stress-lg', 'stress-xl', 'stress-xxl',
  'stress-xs-inverse', 'stress-sm-inverse', 'stress-md-inverse', 'stress-lg-inverse', 'stress-xl-inverse', 'stress-xxl-inverse',
  'stress-hover', 'stress-selected', 'stress-outline', 'stress-disabled',
  'stress-none',
]

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: TYPOGRAPHY_SCALE,
      spacing: NAMED_SPACING,
      animate: MOTION,
    },
    classGroups: {
      'z': LAYER_CLASSES,
      'bg-image': STRESS_OVERLAY_CLASSES,
      'text-color': ['text-base'],
    },
  },
})

const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export { cn, LAYER_CLASSES, MOTION, NAMED_SPACING, STRESS_OVERLAY_CLASSES, TYPOGRAPHY_SCALE }
