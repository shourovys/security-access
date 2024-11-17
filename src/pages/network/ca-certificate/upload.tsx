import { sendPostRequest } from '../../../api/swrConfig'
import { networkApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import CaCertificateUploadForm from '../../../components/pages/network/CaCertificateUploadForm'
import useLogoutMutation from '../../../hooks/useLogoutMutation'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import routeProperty from '../../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  IFormErrors,
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../../types/pages/common'
import { INetworkCaCertificateFormData } from '../../../types/pages/network'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../../utils/toast'
import t from '../../../utils/translator'
import serverErrorHandler from '../../../utils/serverErrorHandler'

// Component to create a CaCertificate
function UploadCaCertificate() {
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  const { logout } = useLogoutMutation()

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<INetworkCaCertificateFormData>({
    Certificate: '',
    CertificateKey: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(networkApi.certificate, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      logout()
      // redirect to network list page on success
      // navigate(routeProperty.networkInfo.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: INewFormErrors<INetworkCaCertificateFormData> = {}
    if (!formData.Certificate) {
      errors.Certificate = t`Certificate is required`
    }
    if (!formData.CertificateKey) {
      errors.CertificateKey = t`Certificate Key is required`
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    trigger(formData)
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
      link: routeProperty.networkInfo.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        pageRoutes={[
          {
            href: routeProperty.networkInfo.path(),
            text: t`Network`,
          },
          {
            href: routeProperty.networkUploadCaCertificate.path(),
            text: t`Upload CA-Certificate`,
          },
        ]}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <CaCertificateUploadForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button size="large" onClick={handleSubmit} isLoading={isMutating || isLogoutLoading}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.networkInfo.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default UploadCaCertificate
