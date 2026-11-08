import type { GalleryEntry, GalleryGroup } from './gallery.type'

type GalleryListing = {
  slug: string
  entry: GalleryEntry
}

type GallerySection = {
  group: GalleryGroup
  listings: GalleryListing[]
}

const GALLERY_GROUPS: readonly GalleryGroup[] = ['primitives', 'composites', 'form', 'patterns']

const gallerySlug = (modulePath: string): string => {
  const fileName = modulePath.split('/').at(-1) ?? modulePath
  return fileName
    .replace(/\.gallery\.tsx$/, '')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

const listGallery = (modules: Record<string, GalleryEntry>): GallerySection[] => {
  const listings = Object.entries(modules)
    .map(([modulePath, entry]) => ({ slug: gallerySlug(modulePath), entry }))
    .toSorted((left, right) => left.entry.title.localeCompare(right.entry.title))
  const slugs = listings.map((listing) => listing.slug)
  const repeated = slugs.filter((slug, index) => slugs.indexOf(slug) !== index)
  if (repeated.length > 0) throw new Error(`gallery entries share a file name: ${repeated.join(', ')}`)
  return GALLERY_GROUPS
    .map((group) => ({ group, listings: listings.filter((listing) => listing.entry.group === group) }))
    .filter((section) => section.listings.length > 0)
}

export { gallerySlug, listGallery }
export type { GalleryListing, GallerySection }
