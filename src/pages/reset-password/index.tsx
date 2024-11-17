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

export default function ResetPassword() {
  const navigate = useNavigate()
  const { isAuthenticated, refresh: refreshAuthData } = useAuth()

  // if user is present then go back
  useEffect(() => {
    if (isAuthenticated) {
      navigate(routeProperty.floorDashboard.path(1))
    }
  }, [isAuthenticated, navigate])

  const [formData, setFormData] = useState({
    SecurityCode: '',
    NewPassword: '',
    RetypePassword: '',
  })
  const [formErrors, setFormErrors] = useState<IFormErrors>({})

  const { trigger, isMutating } = useSWRMutation(authApi.resetPassword, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast(t`Success.`)
      navigate(routeProperty.login.path())
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
  function validateForm() {
    const errors: IFormErrors = {}
    if (!formData.SecurityCode) errors.SecurityCode = t`Security Code is required`
    if (!formData.NewPassword) errors.NewPassword = t`New Password is required`
    if (!formData.RetypePassword) errors.RetypePassword = t`Retype Password is required`
    if (formData.NewPassword !== formData.RetypePassword)
      errors.RetypePassword = t`Passwords do not match`
    setFormErrors(errors)

    Object.values(errors).forEach((error) => warningToast(error as string))
    return !Object.keys(errors).length
  }

  // Function to handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      trigger({
        SecurityCode: formData.SecurityCode,
        NewPassword: formData.NewPassword,
      })
    }
  }

  useEffect(() => {
    window.onkeyup = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (document.hasFocus()) {
          handleSubmit()
        }
      }
    }

    return () => {
      window.onkeyup = null
    }
  }, [handleSubmit])

  return (
    <Page>
      <GuestGuard>
        <AuthLayout>
          <div className="space-y-3">
            <Input
              name="SecurityCode"
              label={t`Security Code`}
              value={formData.SecurityCode}
              onChange={handleInputChange}
              error={formErrors.SecurityCode}
            />
            <Input
              name="NewPassword"
              label={t`New Password`}
              type="password"
              value={formData.NewPassword}
              onChange={handleInputChange}
              error={formErrors.NewPassword}
            />
            <Input
              name="RetypePassword"
              label={t`Retype Password`}
              type="password"
              value={formData.RetypePassword}
              onChange={handleInputChange}
              error={formErrors.RetypePassword}
            />
          </div>

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
