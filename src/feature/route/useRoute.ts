import { matchPath, useLocation, useNavigate } from 'react-router'

import { hrefFor, type RouteArgs, type RouteName, SITEMAP } from './sitemap'

const useRoute = () => {
  const navigateTo = useNavigate()
  const location = useLocation()

  return {
    pathname: location.pathname,
    href: hrefFor,
    isActive: (name: RouteName) => matchPath(SITEMAP[name].path, location.pathname) !== null,
    navigate: <N extends RouteName>(name: N, ...args: RouteArgs<N>) => {
      void navigateTo(hrefFor(name, ...args))
    },
    replace: <N extends RouteName>(name: N, ...args: RouteArgs<N>) => {
      void navigateTo(hrefFor(name, ...args), { replace: true })
    },
  }
}

export { useRoute }
