import { lazy, Suspense, useState } from 'react'
import { createBrowserRouter, Outlet, type RouteObject, useLocation } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { useCopy } from '@/feature/copy/useCopy'
import { AppShell } from '@/feature/nav/AppShell'
import { LeaveGuardProvider } from '@/feature/route/LeaveGuard'
import { SITEMAP } from '@/feature/route/sitemap'
import { Toaster } from '@/feature/toast/Toaster'

import { ErrorBoundary, ErrorFallback } from './ErrorBoundary'
import { NotFound } from './NotFound'

const HomePage = lazy(() => import('@/feature/home/Home.page.tsx'))
const GalleryPage = lazy(() => import('@/feature/gallery/Gallery.page.tsx'))
const ItemsPage = lazy(() => import('@/feature/example/Items.page.tsx'))

const RouteLoading = () => {
  const { t } = useCopy()

  return (
    <output className="block p-gutter text-body2 text-stress-xxl">
      {t('common.loading')}
    </output>
  )
}

RouteLoading.displayName = 'RouteLoading'

const RouteError = () => <ErrorFallback onRetry={() => window.location.reload()} />

RouteError.displayName = 'RouteError'

const RootLayout = () => {
  const location = useLocation()

  return (
    <LeaveGuardProvider>
      <AppShell>
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<RouteLoading />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </AppShell>
      <Toaster />
    </LeaveGuardProvider>
  )
}

RootLayout.displayName = 'RootLayout'

const APP_ROUTES: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { path: SITEMAP.home.path, element: <HomePage /> },
      { path: SITEMAP.items.path, element: <ItemsPage /> },
      { path: SITEMAP.gallery.path, element: <GalleryPage /> },
      { path: SITEMAP.galleryTokens.path, element: <GalleryPage /> },
      { path: SITEMAP.galleryEntry.path, element: <GalleryPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

const AppRouter = () => {
  const [router] = useState(() => createBrowserRouter(APP_ROUTES))
  return <RouterProvider router={router} />
}

AppRouter.displayName = 'AppRouter'

export { APP_ROUTES, AppRouter }
