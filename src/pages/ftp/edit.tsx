import { sendPostRequest } from '../../api/swrConfig'
import { ftpApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import FtpForm from '../../components/pages/ftp/FtpForm'
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
import { IFtpFormData, IFtpResult } from '../../types/pages/ftp'
import { findSelectOption } from '../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../utils/toast'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to edit Ftp
function EditFtp() {
  const navigate = useNavigate()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IFtpFormData>({
    Enable: null,
    ServerAddr: '',
    ServerPort: '',
    UserId: '',
    Password: '',
    Path: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Fetch the details of the Ftp from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IFtpResult>>(ftpApi.details)
  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Enable, ServerAddr, ServerPort, UserId, Password, Path } = data.data
      setFormData({
        Enable: findSelectOption(booleanSelectOption, Enable),
        ServerAddr,
        ServerPort: ServerPort.toString(),
        UserId,
        Password,
        Path,
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(ftpApi.edit, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.ftpInfo.path())
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
      if (!formData.ServerAddr) {
        errors.ServerAddr = t`Server Address is required`
      }
      if (!formData.ServerPort) {
        errors.ServerPort = t`Server Port is required`
      }
      if (!formData.UserId) {
        errors.UserId = t`User ID is required`
      }
      if (!formData.Password) {
        errors.Password = t`Password is required`
      }
      if (!formData.Path) {
        errors.Path = t`Path is required`
      }
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      Enable: Number(formData.Enable?.value),
      ServerAddr: formData.ServerAddr,
      ServerPort: Number(formData.ServerPort),
      UserId: formData.UserId,
      Password: formData.Password,
      Path: formData.Path,
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
      link: routeProperty.ftpInfo.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        pageRoutes={[
          {
            href: routeProperty.ftpInfo.path(),
            text: t`FTP`,
          },
          {
            href: routeProperty.ftpEdit.path(),
            text: t`Edit`,
          },
        ]}
        pageTitle="FTP"
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <FtpForm
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
        <Button size="large" color="cancel" link={routeProperty.ftpInfo.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditFtp
