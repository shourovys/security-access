import { sendPostRequest } from '../../api/swrConfig'
import { gatewayApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import Modal from '../../components/HOC/modal/Modal'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import NewCredentialModal from '../../components/pages/gateway/NewCredential/NewCredentialModal'
import { useDefaultNodeOption } from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../types/pages/common'
import { IGatewayFormData } from '../../types/pages/gateway'
import { applyIcon, cancelIcon, credentialIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../utils/toast'
import validateGatewayFormData from '../../utils/validation/gateway'
import GatewayForm from '../../components/pages/gateway/form/GatewayForm'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to create a Gateway
function CreateGateway() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IGatewayFormData>({
    Node: null,
    UserId: '',
    IpAddress: '',
    ApiPort: '',
    GatewayName: '',
    GatewayDesc: '',
    Password: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)
  // Set default Node
  useDefaultNodeOption<IGatewayFormData>(setFormData)

  // Define the state for manage new credential modal state
  const [newCredentialModal, setNewCredentialModal] = useState<boolean>(false)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(gatewayApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to gateway list page on success
      navigate(routeProperty.gateway.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateGatewayFormData(formData)

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      NodeNo: formData.Node?.value,
      UserId: formData.UserId,
      IpAddress: formData.IpAddress,
      ApiPort: formData.ApiPort,
      GatewayName: formData.GatewayName,
      GatewayDesc: formData.GatewayDesc,
      Password: formData.Password,
    }

    trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: credentialIcon,
      text: t`New Credential`,
      onClick: () => setNewCredentialModal(true),
      disabled: !formData.ApiPort || !formData.IpAddress,
    },
  ]
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
      link: routeProperty.gateway.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        breadcrumbsActionsButtons={breadcrumbsActionsButtons}
        breadcrumbsActions={breadcrumbsActions}
      />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <GatewayForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.gateway.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
      {/* New Credential modal */}
      <Modal openModal={newCredentialModal} setOpenModal={setNewCredentialModal}>
        <NewCredentialModal
          parentFormData={formData}
          handleParentInputChange={handleInputChange}
          setOpenModal={setNewCredentialModal}
        />
      </Modal>
    </Page>
  )
}

export default CreateGateway
