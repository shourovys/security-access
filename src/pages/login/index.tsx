import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { authApi } from '../../api/urls'
import AuthLayout from '../../components/HOC/AuthLayout'
import Page from '../../components/HOC/Page'
import Button from '../../components/atomic/Button'
import Input from '../../components/atomic/Input'
import GuestGuard from '../../guards/GuestGuard'
import useAuth from '../../hooks/useAuth'
import routeProperty from '../../routes/routeProperty'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../types/pages/common'
import { IConfigWithToken } from '../../types/pages/login'
import checkPermission from '../../utils/checkPermission'
import { setSession } from '../../utils/jwt'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { warningToast } from '../../utils/toast'
import t from '../../utils/translator'

export default function Login() {
  const navigate = useNavigate()
  const { refresh: refreshAuthData, login: contextLogin, isAuthenticated, license } = useAuth()

  // if user is present then go back
  useEffect(() => {
    if (isAuthenticated) {
      navigate(routeProperty.floorDashboard.path(1))
    }
  }, [isAuthenticated])

  const [formData, setFormData] = useState({ username: '', password: '' })
  const [formErrors, setFormErrors] = useState<IFormErrors>({})

  const { trigger, isMutating } = useSWRMutation(authApi.login, sendPostRequest, {
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  })

  // Function to handle successful login
  function handleLoginSuccess({ data }: ISingleServerResponse<IConfigWithToken>) {
    setSession(data.token)
    contextLogin(data.config)
    refreshAuthData()

    // Handle redirection after login
    handleRedirection(data)
  }

  // Function to handle login errors
  function handleLoginError(error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) {
    serverErrorHandler(error, setFormErrors)
  }

  // Function to handle redirection after login
  function handleRedirection(data: IConfigWithToken) {
    const layout = data?.config?.layout
    // const previousPath = location.state?.previousPath
    // const favoritePages = data.config.permissions.filter((page) => page.is_favorite)

    if (layout === 'Initial') {
      navigate(routeProperty.licenseInfo.path())
      return // No need to proceed further
    } else if (layout === 'Worker') {
      navigate(routeProperty.licenseInfo.path())
      return // No need to proceed further
    }
    // else if (data.config.user?.Launch) {
    //   const userLaunchPage = ReactRoutes.find(
    //     (route) => route.id === data.config.user?.Launch.toString()
    //   )
    //   if (userLaunchPage) {
    //     navigate(userLaunchPage.path())
    //   }
    // }
    else {
      // navigate to the first user role page
      const userRolePages = data.config.permissions.find((page) => page.access)
      const isFavoritePresent = data.config.permissions.some((permission) => permission.is_favorite)

      if (userRolePages) {
        // match id with route id
        const labelRoute = Object.values(routeProperty).filter((obj) =>
          Object.prototype.hasOwnProperty.call(obj, 'label')
        )

        let redirectPage = ''

        if (data.config.user?.Launch) {
          redirectPage =
            labelRoute
              .find((route) => {
                return (
                  route.id === data.config.user?.Launch.toString() &&
                  checkPermission(
                    route.permissions,
                    data.config.permissions,
                    license,
                    isFavoritePresent
                  )
                )
              })
              ?.path() || ''
        }

        if (!redirectPage) {
          redirectPage =
            labelRoute
              .find((route) => {
                return checkPermission(
                  route.permissions,
                  data.config.permissions,
                  license,
                  isFavoritePresent
                )
              })
              ?.path() || ''
        }

        if (redirectPage) {
          navigate(redirectPage)
          return // No need to proceed further
        }
      }

      //navigate(redirectToFirstFavoritePage(favoritePages))
      // window.location.href = redirectToFirstFavoritePage(favoritePages)
      // Navigate to the first favorite page if available
      return // No need to proceed further
    }

    // if (previousPath) {
    //   const previousRoute = ReactRoutes.find((route) => route.path() === previousPath)
    //
    //   if (previousRoute && checkPermission(previousRoute.permissions, data.config.permissions)) {
    //     navigate(previousPath) // Navigate back to the previous page
    //   } else {
    //     redirectToFirstFavoritePage(favoritePages) // Navigate to the first favorite page if available
    //   }
    //   return // No need to proceed further
    // }

    // const hasDashboardPermission = checkPermission(
    //   routeProperty.dashboard.permissions,
    //   data.config.permissions
    // )

    //   const historyState = window.history.length > 1
    //   const previousRoute = ReactRoutes.find((route) => route.path() === window.location.pathname)

    //   if (
    //     historyState &&
    //     previousRoute &&
    //     checkPermission(previousRoute.permissions, data.config.permissions)
    //   ) {
    //     navigate(-1) // Navigate back to the previous page
    //   } else {
    //     redirectToFirstFavoritePage(favoritePages) // Navigate to the first favorite page if available
    //   }
    // }
  }

  // Function to redirect to the first favorite page if available, else navigate to the favorite page
  // function redirectToFirstFavoritePage(favoritePages: IPermissionResult[]): string {
  //   if (!favoritePages.length) {
  //     return routeProperty.favorite.path()
  //   }

  //   const sortedFavoritePages: IPermissionResult[] = favoritePages.sort(
  //     (a, b) => a.position - b.position
  //   )
  //   const labelRoute = Object.values(routeProperty).filter((obj) =>
  //     Object.prototype.hasOwnProperty.call(obj, 'label')
  //   )

  //   const firstPermittedFavoritePageRoute = labelRoute
  //     .map((route) => route as ILabeledRoute)
  //     .find(
  //       (route) =>
  //         route.id === sortedFavoritePages[0].id.toString() &&
  //         checkPermission(route.permissions, favoritePages)
  //     )

  //   if (firstPermittedFavoritePageRoute) {
  //     return firstPermittedFavoritePageRoute.path()
  //   } else {
  //     return routeProperty.favorite.path()
  //   }
  // }

  // Function to handle input changes
  const handleInputChange = useCallback((name: string, value: string) => {
    setFormData((state) => ({ ...state, [name]: value }))
  }, [])

  // Function to validate the form
  function validateForm(username?: string, password?: string) {
    const errors: IFormErrors = {}
    if (!username && !formData.username) errors.username = t`Username is required`
    if (!password && !formData.password) errors.password = t`Password is required`
    setFormErrors(errors)

    Object.values(errors).forEach((error) => warningToast(error as string))
    return !Object.keys(errors).length
  }

  // Function to handle form submission
  const handleSubmit = (username?: string, password?: string) => {
    if (formData.username && formData.password) {
      window.sessionStorage.setItem('UserId', formData.username)
      window.sessionStorage.setItem('Password', formData.password)
    }
    if (validateForm(username, password)) {
      trigger({
        username: formData.username || username,
        password: formData.password || password,
      })
    }
  }

  useEffect(() => {
    window.onkeyup = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (document.hasFocus()) {
          handleSubmit(formData.username, formData.password)
        }
      }
    }

    return () => {
      window.onkeyup = null
    }
  }, [formData.username, formData.password])

  return (
    <Page>
      <GuestGuard>
        <AuthLayout>
          <Input
            name="username"
            label={t`Username`}
            value={formData.username}
            onChange={handleInputChange}
            error={formErrors.username}
          />
          <Input
            name="password"
            label={t`Password`}
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="remember-me" className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
              />
              <p className="block ml-2 text-sm text-gray-900">{t`Remember me`}</p>
            </label>

            {/*<div className="hidden text-sm sm:block">*/}
            {/*  <a*/}
            {/*    // href="#"*/}
            {/*    className="font-medium cursor-pointer text-primary hover:text-primary"*/}
            {/*  >*/}
            {/*    Forgot your password?*/}
            {/*  </a>*/}
            {/*</div>*/}
          </div>
          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={isMutating}
              onClick={() => handleSubmit()}
            >
              {t`Login`}
            </Button>
          </div>
          <div className="text-sm text-center">
            <Link
              to={routeProperty.forgotPassword.path()}
              className="font-medium cursor-pointer underline p-2"
            >
              {t`Forgot your password?`}
            </Link>
          </div>
        </AuthLayout>
      </GuestGuard>
    </Page>
  )
}
