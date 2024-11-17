import { sendPostRequest } from '../../api/swrConfig'
import { logApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import LogApiForm from '../../components/pages/logApi/LogApiForm'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  booleanSelectOption,
} from '../../types/pages/common'
import { ILogApiFormData, ILogApiResult } from '../../types/pages/logApi'
import { findSelectOption } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'
import serverErrorHandler from '../../utils/serverErrorHandler'

// Component to edit LogApi
function EditLogApi() {
  const navigate = useNavigate()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<ILogApiFormData>({
    Enable: null,
    EndPoint: '',
    UserId: '',
    Password: '',
    SiteId: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the LogApi from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ILogApiResult>>(logApi.details)
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Enable, EndPoint, UserId, Password, SiteId } = data.data
      setFormData({
        Enable: findSelectOption(booleanSelectOption, Enable),
        EndPoint,
        UserId,
        Password,
        SiteId,
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(logApi.edit, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.logApiInfo.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (formData.Enable?.value === '1') {
      // console.log(
      //   '🚀 ~ file: edit.tsx:77 ~ handleSubmit ~ formData.Enable?.value:',
      //   formData.Enable?.value
      // )
      if (!formData.EndPoint) {
        errors.EndPoint = t`End Point is required`
      }
      if (!formData.UserId) {
        errors.UserId = t`Username is required`
      }
      if (!formData.Password) {
        errors.Password = t`Password is required`
      }
      if (!formData.SiteId) {
        errors.SiteId = t`Site ID is required`
      }
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      //Object.entries(errors).forEach(([, value]) => {
      //   if (value) {
      //     errorToast(value)
      //   }
      // })
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      Enable: Number(formData.Enable?.value),
      EndPoint: formData.EndPoint,
      UserId: formData.UserId,
      Password: formData.Password,
      SiteId: formData.SiteId,
    }
    trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActionsButtons: IActionsButton[] = [
    {
      color: 'apply',
      icon: applyIcon,
      text: t`Apply`,
      onClick: handleSubmit,
      isLoading: isMutating,
    },
    {
      color: 'cancel',
      icon: cancelIcon,
      text: t`Cancel`,
      link: routeProperty.emailInfo.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        pageRoutes={[
          {
            href: routeProperty.logApiInfo.path(),
            text: t`Log API`,
          },
          {
            href: routeProperty.logApiEdit.path(),
            text: t`Edit`,
          },
        ]}
        pageTitle="Log API"
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <LogApiForm
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.logApiInfo.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditLogApi
