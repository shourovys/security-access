import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { favoriteApi } from '../api/urls'
import { ReactRoutes } from '../routes/routeProperty'
import { ISingleServerResponse } from '../types/pages/common'
import { IFavoriteResult, IPageInfo } from '../types/pages/favorite'
import { ILabeledRoute } from '../types/routes'
import useAuth from './useAuth'

// Define the custom hook for fetching favorite pages data
export const useFavoritePages = () => {
  const { isAuthenticated, permissions } = useAuth()

  const onlyLabelRoutes = ReactRoutes.filter((route) => 'label' in route)
  const [favoritePages, setFavoritePages] = useState<ILabeledRoute[]>([])
  const { isLoading, data } = useSWR<ISingleServerResponse<IFavoriteResult[]>>(
    isAuthenticated ? favoriteApi.list : null
  )

  useEffect(() => {
    if (data) {
      const { data: favoriteData } = data

      const accessPermission: { [k: number]: boolean } = permissions.reduce(
        (acc, { id, access }) => ({
          ...acc,
          [id]: access,
        }),
        {}
      )

      const favoriteRoutes: ILabeledRoute[] = favoriteData
        .map(({ Page: serverPage }: { Page: IPageInfo }) => {
          const isPresent = onlyLabelRoutes.find(
            (route) =>
              serverPage &&
              route.id === serverPage.PageNo.toString() &&
              accessPermission[serverPage.PageNo]
          )
          if (isPresent) {
            return {
              id: isPresent.id,
              label: isPresent.label,
              path: isPresent.path,
              icon: isPresent.icon,
              permissions: isPresent.permissions,
            }
          }
        })
        .filter(Boolean) as ILabeledRoute[]

      setFavoritePages(favoriteRoutes)
    }
  }, [data])

  return { favoritePages, isLoading }
}
