import { sendPutRequest } from '../../../api/swrConfig'
import { gatewayApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import Modal from '../../../components/HOC/modal/Modal'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import NewCredentialModal from '../../../components/pages/gateway/NewCredential/NewCredentialModal'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../types/pages/common'
import { IGatewayFormData, IGatewayResult } from '../../../types/pages/gateway'
import { applyIcon, cancelIcon, credentialIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import validateGatewayFormData from '../../../utils/validation/gateway'
import GatewayForm from '../../../components/pages/gateway/form/GatewayForm'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'

// Component to edit a Gateway
function EditGateway() {
  const navigate = useNavigate()
  // Get the gateway ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
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

  // Define the state for manage new credential modal state
  const [newCredentialModal, setNewCredentialModal] = useState<boolean>(false)

  // Fetch the details of the Gateway from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IGatewayResult>>(
    queryId ? gatewayApi.details(queryId) : null
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { GatewayName, GatewayDesc, Node, IpAddress, ApiPort, UserId, Password } = data.data
      setFormData({
        GatewayName,
        GatewayDesc,
        Node: {
          value: Node.NodeNo.toString(),
          label: Node.NodeName,
        },
        IpAddress,
        ApiPort: ApiPort.toString(),
        UserId,
        Password,
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(gatewayApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.gatewayInfo.path(queryId))
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
      //Object.entries(errors).forEach(([, value]) => {
      //   if (value) {
      //     errorToast(value)
      //   }
      // })
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
      link: routeProperty.gatewayInfo.path(queryId),
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
          isLoading={isLoading}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.gatewayInfo.path(queryId)}>
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

export default EditGateway
