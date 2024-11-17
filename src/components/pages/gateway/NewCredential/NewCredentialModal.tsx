import { fetcher, sendPostRequest } from '../../../../api/swrConfig'
import { gatewayApi } from '../../../../api/urls'
import { AxiosError } from 'axios'
import FormActionButtonsContainer from '../../../../components/HOC/style/form/FormActionButtonsContainer'
import FormContainer from '../../../../components/HOC/style/form/FormContainer'
import Button from '../../../../components/atomic/Button'
import useStateWithCallback from '../../../../hooks/useStateWithCallback'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { THandleInputChange } from '../../../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../../../types/pages/common'
import {
  IGatewayFormData,
  IGatewayNewCredentialFormData,
  INewCredentialResult,
} from '../../../../types/pages/gateway'
import Icon, { applyIcon, cancelIcon, credentialIcon } from '../../../../utils/icons'
import scrollToErrorElement from '../../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../../../utils/toast'
import t from '../../../../utils/translator'
import NewCredentialForm from './NewCredentialForm'

interface IProps {
  parentFormData: IGatewayFormData
  handleParentInputChange: THandleInputChange
  setOpenModal: (openModal: boolean) => void
}

const NewCredentialModal = ({ parentFormData, handleParentInputChange, setOpenModal }: IProps) => {
  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IGatewayNewCredentialFormData>({
    UserId: '',
    Password: '',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<
    INewFormErrors<IGatewayNewCredentialFormData>
  >({}, scrollToErrorElement)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // mutation for fetch new credential data from server and set in formData
  const { trigger: getNewCredentialTrigger, isMutating: getNewCredentialLoading } = useSWRMutation(
    gatewayApi.getNewCredential(parentFormData.IpAddress, parentFormData.ApiPort),
    fetcher,
    {
      onSuccess: (newCredentialData: ISingleServerResponse<INewCredentialResult | string>) => {
        if (typeof newCredentialData.data !== 'string') {
          handleInputChange('UserId', newCredentialData.data.credentials.usr)
          handleInputChange('Password', newCredentialData.data.credentials.pwd)
        }
      },
      onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
        serverErrorHandler(error, setFormErrors)
      },
    }
  )

  const handleNewCredentialApply = () => {
    setOpenModal(false)

    handleParentInputChange('UserId', formData.UserId)
    handleParentInputChange('Password', formData.Password)
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(gatewayApi.serNewCredential, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      handleNewCredentialApply()
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: INewFormErrors<IGatewayNewCredentialFormData> = {}

    if (!formData.UserId) {
      errors.UserId = t`UserId is required`
    }

    if (!formData.Password) {
      errors.Password = t`Password is required`
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      // error_toast
      return
    }

    trigger({
      IpAddress: parentFormData.IpAddress,
      ApiPort: parentFormData.ApiPort,
    })
  }

  return (
    <div className="w-full px-4 pt-4 bg-white rounded-md">
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <NewCredentialForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
        />
      </FormContainer>
      <FormActionButtonsContainer allowsShow>
        <Button
          size="base"
          color="danger"
          onClick={() => getNewCredentialTrigger()}
          isLoading={getNewCredentialLoading}
        >
          <Icon icon={credentialIcon} />
          <span>Get New Credential</span>
        </Button>
        <Button
          size="base"
          color="danger"
          onClick={handleSubmit}
          isLoading={isMutating}
          disabled={!formData.UserId || !formData.Password}
        >
          <Icon icon={credentialIcon} />
          <span>Set New Credential</span>
        </Button>
        <Button
          size="base"
          onClick={handleNewCredentialApply}
          disabled={!formData.UserId || !formData.Password}
        >
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="base" color="cancel" onClick={() => setOpenModal(false)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer>
    </div>
  )
}

export default NewCredentialModal
