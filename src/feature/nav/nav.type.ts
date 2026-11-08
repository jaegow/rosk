import type { RouteArgs, RouteName } from '@/feature/route/sitemap'

type NavVariant = 'side' | 'top'

type NavRoute = { [N in RouteName]: RouteArgs<N> extends [] ? N : never }[RouteName]

export type { NavRoute, NavVariant }
