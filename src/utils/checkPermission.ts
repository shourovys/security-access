import routeProperty from '../routes/routeProperty'
import { IPermission, IPermissionResult } from '../types/context/auth'
import { ILicenseResult } from '../types/pages/license'

/**
 * Check if the user has permission to access the route.
 *
 * @param routePermission The permission required to access the route
 * @param userPermissions The permissions of the current user
 * @returns `true` if the user has permission to access the route, `false` otherwise
 */
function checkPermission(
  routePermission: IPermission,
  userPermissions: IPermissionResult[],
  userLicense: ILicenseResult | null,
  checkFavorite?: boolean
): boolean {
  const isSixOptionPresent = userLicense?.Options[5] === '1'

  // If route permission is a string, check if it matches the user's permission
  if (typeof routePermission === 'string') {
    // if (routePermission === '') {
    //   return false
    // }
    if (routePermission === '*') {
      return true
    }
  } else if (
    routeProperty.inviteInfo.id &&
    routePermission.includes(routeProperty.inviteInfo.id) &&
    !isSixOptionPresent
  ) {
    return false
  }

  // If route permission is an array, check each permission and return `true` if at least one matches the user's permission
  if (routePermission.length > 0) {
    if (checkFavorite) {
      return !!userPermissions.find((userPermission) => {
        return (
          routePermission.includes(userPermission.id.toString()) &&
          userPermission.access &&
          userPermission.is_favorite
        )
      })
    }
    return !!userPermissions.find(
      (userPermission) =>
        routePermission.includes(userPermission.id.toString()) && userPermission.access
    )
  }

  // If none of the conditions above are met, return false
  return false
}

export default checkPermission
