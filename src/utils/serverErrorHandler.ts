import { AxiosError } from 'axios'
import routeProperty from '../routes/routeProperty'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../types/pages/common'
import { warningToast } from './toast'
import t from './translator'

const serverErrorHandler = (
  error: AxiosError<IServerCommandErrorResponse | IServerErrorResponse>,
  errorStateSetter?: (state: IFormErrors) => void
) => {
  if (error.response?.status === 403) {
    warningToast('Your login session is expired')
    setTimeout(() => {
      window.location.replace(routeProperty.login.path())
    }, 2000)
    return
  }

  if (error.response?.status === 424 && error.response?.data?.cgi) {
    if (Array.isArray(error.response.data.cgi)) {
      // error.response.data.cgi.forEach((cgi) => {
      //   if (!cgi.success && cgi.errors) {
      //     warningToast(`Error - ${cgi.errors}`)
      //   }
      // })

      for (const cgi of error.response.data.cgi) {
        if (!cgi.success && cgi.errors) {
          warningToast(cgi.errors)
          break
        }
      }
    } else {
      if (!error.response.data.cgi.success && error.response.data.cgi.errors) {
        warningToast(error.response.data.cgi.errors)
      }
    }
    return
  }

  if (error.response && error.response.data) {
    const serverErrors: IFormErrors = {}

    // Check if 'errors' property exists and handle accordingly

    if ('detail' in error.response.data) {
      warningToast(error.response.data.detail as string)
      return
    }

    if (typeof error.response.data === 'string') {
      warningToast(error.response.data)
    } else if ('errors' in error.response.data) {
      if (typeof error.response.data.errors === 'string') {
        warningToast(error.response.data.errors)
      } else {
        Object.entries(error.response.data.errors || {}).forEach(([key, errorValue]) => {
          if (typeof errorValue === 'string') {
            warningToast(errorValue)
          } else {
            serverErrors[key] = t(errorValue[0])
          }
        })
      }
    }

    if (errorStateSetter) errorStateSetter(serverErrors)
  }
}

export default serverErrorHandler
