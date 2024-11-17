import LoadingSvg from '../../components/loading/atomic/LoadingSvg'
import NotFoundPage from '../../pages/NotFound'
import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import TopBarProgress from 'react-topbar-progress-indicator'
import { IRoute } from '../../types/routes'

// function RenderRouteWithSubRoutes({ route }: { route: IRoute }) {
//   return (
//     <Route
//       path={route.routePath}
//       element={<route.component />}
//       // render={props => <route.component {...props} />}
//     />
//   )
// }
// export { RenderRouteWithSubRoutes }

TopBarProgress.config({
  barColors: {
    '0': '#006AFE',
    '1.0': '#006AFE',
  },
  shadowBlur: 5,
})

export function RenderRoutes({ routes }: { routes: IRoute[] }) {
  return (
    <Suspense
      fallback={
        <>
          <TopBarProgress />
          <div
            className="flex items-center justify-center w-full h-full"
            style={{ height: '80vh' }}
          >
            <LoadingSvg size="extraLarge" />
          </div>
        </>
      }
    >
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.routePath}
            path={route.routePath}
            element={<route.component />}
            // render={props => <route.component {...props} />}
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
