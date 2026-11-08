import { describe, expect, it } from 'vitest'

import type { GalleryEntry } from './gallery.type'
import { gallerySlug, listGallery } from './gallery.util'

const entry = (title: string, group: GalleryEntry['group']): GalleryEntry => ({ title, group, examples: [] })

describe('gallerySlug', () => {
  it.each([
    ['/src/feature/cta/CTA.gallery.tsx', 'cta'],
    ['/src/feature/cta/CTABar.gallery.tsx', 'cta-bar'],
    ['/src/feature/count-badge/CountBadge.gallery.tsx', 'count-badge'],
    ['/src/feature/dropdown-menu/DropdownMenu.gallery.tsx', 'dropdown-menu'],
  ])('names %s as %s', (modulePath, slug) => {
    expect(gallerySlug(modulePath)).toBe(slug)
  })
})

describe('listGallery', () => {
  it('groups entries in group order, sorts each group by title and drops empty groups', () => {
    const sections = listGallery({
      '/src/feature/tabs/Tabs.gallery.tsx': entry('Tabs', 'primitives'),
      '/src/feature/form/Form.gallery.tsx': entry('Form', 'form'),
      '/src/feature/chip/Chip.gallery.tsx': entry('Chip', 'primitives'),
    })
    expect(sections.map((section) => ({ group: section.group, slugs: section.listings.map((listing) => listing.slug) }))).toEqual([
      { group: 'primitives', slugs: ['chip', 'tabs'] },
      { group: 'form', slugs: ['form'] },
    ])
  })

  it('refuses two entries whose file names give the same slug', () => {
    expect(() => listGallery({
      '/src/feature/a/Chip.gallery.tsx': entry('Chip', 'primitives'),
      '/src/feature/b/Chip.gallery.tsx': entry('Other Chip', 'patterns'),
    })).toThrow('gallery entries share a file name: chip')
  })
})
