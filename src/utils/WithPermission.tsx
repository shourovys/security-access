import { useMemo } from 'react'
import useAuth from '../hooks/useAuth'
import { IPermission } from '../types/context/auth'
import checkPermission from '../utils/checkPermission'

interface IProps {
  children: JSX.Element | JSX.Element[]
  actionPermission: IPermission
}

function WithPermission({ children, actionPermission }: IProps) {
  const { isAuthenticated, permissions, license } = useAuth()

  const userPermissions = useMemo(() => {
    if (isAuthenticated && permissions) {
      return permissions.map((permission) => permission)
    }
    return []
  }, [isAuthenticated, permissions])

  const isPermitted = useMemo(() => {
    return checkPermission(actionPermission, userPermissions, license)
  }, [actionPermission, userPermissions])

  if (isPermitted) {
    return children
  }
  return null
}

export default WithPermission
