const SITEMAP = {
  home: { path: '/' },
  items: { path: '/items' },
  gallery: { path: '/gallery' },
  galleryTokens: { path: '/gallery/tokens' },
  galleryEntry: { path: '/gallery/:entry' },
} as const

type RouteName = keyof typeof SITEMAP

type RoutePath<N extends RouteName> = (typeof SITEMAP)[N]['path']

type PathParamNames<P extends string> =
  P extends `${string}:${infer Param}/${infer Rest}`
    ? Param | PathParamNames<`/${Rest}`>
    : P extends `${string}:${infer Param}`
      ? Param
      : never

type RouteParams<N extends RouteName> = { [Param in PathParamNames<RoutePath<N>>]: string | number }

type RouteArgs<N extends RouteName> = [PathParamNames<RoutePath<N>>] extends [never] ? [] : [params: RouteParams<N>]

const hrefFor = <N extends RouteName>(name: N, ...args: RouteArgs<N>): string => {
  const params: Partial<Record<string, string | number>> = args[0] ?? {}
  return SITEMAP[name].path.replace(/:(\w+)/g, (_match, param: string) => {
    const value = params[param]
    if (value === undefined) throw new Error(`route ${name} needs the ${param} param`)
    return encodeURIComponent(String(value))
  })
}

export { hrefFor, SITEMAP }
export type { PathParamNames, RouteArgs, RouteName, RouteParams }
