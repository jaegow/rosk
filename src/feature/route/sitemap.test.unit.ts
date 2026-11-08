import { describe, expect, expectTypeOf, it } from 'vitest'

import { hrefFor, type PathParamNames, type RouteName, SITEMAP } from './sitemap'

describe('sitemap', () => {
  it('names each route once with a unique absolute path', () => {
    const paths = Object.values(SITEMAP).map((route) => route.path)
    expect(new Set(paths).size).toBe(paths.length)
    expect(paths.every((path) => path.startsWith('/'))).toBe(true)
  })

  it('builds the href of a route without params', () => {
    expect(hrefFor('home')).toBe('/')
    expect(hrefFor('gallery')).toBe('/gallery')
  })

  it('reads every :param out of a path pattern', () => {
    expectTypeOf<PathParamNames<'/items/:itemId/notes/:noteId'>>().toEqualTypeOf<'itemId' | 'noteId'>()
    expectTypeOf<PathParamNames<'/items/:itemId'>>().toEqualTypeOf<'itemId'>()
    expectTypeOf<PathParamNames<'/items'>>().toEqualTypeOf<never>()
  })

  it('types route names from the sitemap keys', () => {
    expectTypeOf<RouteName>().toEqualTypeOf<'home' | 'items' | 'gallery' | 'galleryTokens' | 'galleryEntry'>()
  })
})
