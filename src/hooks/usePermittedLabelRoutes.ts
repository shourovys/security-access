// eslint-disable-next-line react/jsx-filename-extension
import { allRoutesInGroup } from '../routes/menu'
import { ILabeledRoute, ILabeledRoutes, IRouteProperty } from '../types/routes'
import checkPermission from '../utils/checkPermission'
import useAuth from './useAuth'

// in useLabelRoutes routes are filtered by permissions
const usePermittedLabelRoutes = (checkFavorite?: boolean) => {
  const { permissions, license } = useAuth()
  const isFavoritePresent = permissions.some((permission) => permission.is_favorite)

  return Object.entries(allRoutesInGroup)
    .map(([key, value]: [string, IRouteProperty]) => {
      const labeledRoute = Object.values(value).filter((obj) => {
        return (
          Object.prototype.hasOwnProperty.call(obj, 'label') &&
          checkPermission(
            obj.permissions,
            permissions,
            license,
            isFavoritePresent && !checkFavorite
          )
        )
      })
      return [key, labeledRoute] as [string, ILabeledRoute[]]
    })
    .reduce((previousValue: ILabeledRoutes, [key, value]: [string, ILabeledRoute[]]) => {
      if (value.length) {
        return { ...previousValue, [key]: value }
      }
      return previousValue
    }, {})
}

export default usePermittedLabelRoutes
