import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '../../types/pages/common'
import serverErrorHandler from '../../utils/serverErrorHandler'
import { addSuccessfulToast, warningToast } from '../../utils/toast'
import t from '../../utils/translator'

export default function ForgatPassword() {
  const navigate = useNavigate()
  const { refresh: refreshAuthData, isAuthenticated } = useAuth()

  // if user is present then go back
  useEffect(() => {
    if (isAuthenticated) {
      navigate(routeProperty.floorDashboard.path(1))
    }
  }, [isAuthenticated])

  const [formData, setFormData] = useState({ Email: '' })
  const [formErrors, setFormErrors] = useState<IFormErrors>({})

  const { trigger, isMutating } = useSWRMutation(authApi.forgotPassword, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast(t`Security Code has been sent to your email to reset your password.`)
      navigate(routeProperty.resetPassword.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Function to handle input changes
  const handleInputChange = useCallback((name: string, value: string) => {
    setFormData((state) => ({ ...state, [name]: value }))
  }, [])

  // Function to validate the form
  function validateForm(Email?: string, password?: string) {
    const errors: IFormErrors = {}
    if (!Email && !formData.Email) errors.Email = t`Email is required`
    setFormErrors(errors)

    Object.values(errors).forEach((error) => warningToast(error as string))
    return !Object.keys(errors).length
  }

  // Function to handle form submission
  const handleSubmit = (Email?: string, password?: string) => {
    if (formData.Email) {
      window.sessionStorage.setItem('UserId', formData.Email)
    }
    if (validateForm(Email, password)) {
      trigger({
        Email: formData.Email || Email,
      })
    }
  }

  useEffect(() => {
    window.onkeyup = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (document.hasFocus()) {
          handleSubmit(formData.Email)
        }
      }
    }

    return () => {
      window.onkeyup = null
    }
  }, [formData.Email])

  return (
    <Page>
      <GuestGuard>
        <AuthLayout>
          <Input
            name="Email"
            label={t`Email`}
            value={formData.Email}
            onChange={handleInputChange}
            error={formErrors.Email}
          />

          <div className="flex items-center justify-center gap-4">
            <Button
              type="submit"
              color="apply"
              isLoading={isMutating}
              onClick={() => handleSubmit()}
            >
              {t`Apply`}
            </Button>
            <Button
              type="button"
              color="cancel"
              onClick={() => navigate(routeProperty.login.path())}
            >
              {t`Cancel`}
            </Button>
          </div>
        </AuthLayout>
      </GuestGuard>
    </Page>
  )
}
