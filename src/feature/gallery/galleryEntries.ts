import type { GalleryEntry } from './gallery.type'
import { listGallery } from './gallery.util'

const GALLERY_SECTIONS = listGallery(import.meta.glob<GalleryEntry>('/src/feature/**/*.gallery.tsx', { eager: true, import: 'gallery' }))

export { GALLERY_SECTIONS }
