import { fetcher } from '../api/swrConfig'
import { authApi } from '../api/urls'
import { AxiosError } from 'axios'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IServerCommandErrorResponse, IServerErrorResponse } from '../types/pages/common'
import serverErrorHandler from '../utils/serverErrorHandler'

type LogoutMutation = {
  logout: () => void
  isLogoutLoading: boolean
}

const useLogoutMutation = (): LogoutMutation => {
  const navigate = useNavigate()
  const { logout: contextLogout } = useAuth()

  const { trigger: logout, isMutating: isLogoutLoading } = useSWRMutation(authApi.logout, fetcher, {
    onSuccess: () => {
      navigate(routeProperty.login.path())
      contextLogout()
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error)
    },
  })

  return {
    logout,
    isLogoutLoading,
  }
}

export default useLogoutMutation
