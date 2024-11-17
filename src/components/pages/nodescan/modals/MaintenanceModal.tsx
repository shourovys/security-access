import { sendPostRequest } from '../../../../api/swrConfig'
import { nodeScanApi } from '../../../../api/urls'
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
} from '../../../../types/pages/common'
import {
  IMaintenanceValue,
  INodeScanFormData,
  INodeScanUpdateFormData,
} from '../../../../types/pages/nodeScan'
import Icon, { applyIcon, cancelIcon } from '../../../../utils/icons'
import scrollToErrorElement from '../../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../../utils/toast'
import serverErrorHandler from '../../../../utils/serverErrorHandler'
import t from '../../../../utils/translator'
import {
  DefaultModalFieldFrom,
  RebootModalFieldFrom,
  UpdateModalFieldFrom,
} from './MaintenanceModalFrom'

interface IProps {
  modalType: IMaintenanceValue | null
  Macs: string[]
  loginInfo: INodeScanFormData
  setOpenModal: (openModal: boolean) => void
}

const MaintenanceModal = ({ modalType, Macs, loginInfo, setOpenModal }: IProps) => {
  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<INodeScanUpdateFormData>({
    Type: '0',
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<INodeScanUpdateFormData>>(
    {},
    scrollToErrorElement
  )

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(nodeScanApi.setMaintenance, sendPostRequest, {
    onSuccess: () => {
      editSuccessfulToast('Success')
      setOpenModal(false)
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: INewFormErrors<INodeScanUpdateFormData> = {}

    if (!formData.Type) {
      errors.Type = t`Type is required`
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
      Macs,
      UserId: loginInfo.UserId,
      Password: loginInfo.Password,
      Action: modalType,
      Type: formData.Type,
    }
    trigger(modifiedFormData)
  }

  return (
    <div className="w-full px-4 pt-4 bg-white rounded-md">
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        {modalType === 'update' && (
          <UpdateModalFieldFrom
            formData={formData}
            handleInputChange={handleInputChange}
            formErrors={formErrors}
          />
        )}
        {modalType === 'reboot' && (
          <RebootModalFieldFrom
            formData={formData}
            handleInputChange={handleInputChange}
            formErrors={formErrors}
          />
        )}
        {modalType === 'default' && (
          <DefaultModalFieldFrom
            formData={formData}
            handleInputChange={handleInputChange}
            formErrors={formErrors}
          />
        )}
      </FormContainer>
      <FormActionButtonsContainer allowsShow>
        <Button size="base" onClick={handleSubmit} isLoading={isMutating}>
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

export default MaintenanceModal
