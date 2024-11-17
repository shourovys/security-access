import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import routeProperty from '../routes/routeProperty'
import { LOCAL_STORAGE_KEY } from '../utils/config'

interface IProps {
  children: JSX.Element
}

export default function GuestGuard({ children }: IProps) {
  const navigate = useNavigate()

  const { isAuthenticated } = useAuth()

  let token: string | null = null
  if (typeof window !== 'undefined') {
    token = window.sessionStorage.getItem(LOCAL_STORAGE_KEY.accessToken)
  }

  useEffect(() => {
    if (isAuthenticated || token) {
      navigate(routeProperty.floorDashboard.path(1))
    }
  }, [isAuthenticated, navigate, token])

  return children
}
