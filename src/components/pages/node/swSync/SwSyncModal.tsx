import { AxiosError } from 'axios'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { sendPostRequestWithFile } from '../../../../api/swrConfig'
import { nodeApi } from '../../../../api/urls'
import Button from '../../../../components/atomic/Button'
import FormActionButtonsContainer from '../../../../components/HOC/style/form/FormActionButtonsContainer'
import FormContainer from '../../../../components/HOC/style/form/FormContainer'
import useStateWithCallback from '../../../../hooks/useStateWithCallback'
import { THandleInputChange } from '../../../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../../../types/pages/common'
import { INodeSwSyncFormData, nodeSwSyncMediaOptionsWithLabel } from '../../../../types/pages/node'
import Icon, { applyIcon, cancelIcon } from '../../../../utils/icons'
import scrollToErrorElement from '../../../../utils/scrollToErrorElement'
import serverErrorHandler from '../../../../utils/serverErrorHandler'
import { editSuccessfulToast } from '../../../../utils/toast'
import t from '../../../../utils/translator'
import SwSyncForm from './SwSyncForm'

interface IProps {
  NodeNo: string[]
  setOpenModal: (openModal: boolean) => void
}

const SwSyncModal = ({ NodeNo, setOpenModal }: IProps) => {
  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<INodeSwSyncFormData>({
    MediaType: nodeSwSyncMediaOptionsWithLabel[0],
    File: null,
    FileName: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<INodeSwSyncFormData>>(
    {},
    scrollToErrorElement
  )

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(nodeApi.swSync, sendPostRequestWithFile, {
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
    const errors: INewFormErrors<INodeSwSyncFormData> = {}

    if (!formData.MediaType?.value) {
      errors.MediaType = t`Media is required`
    }
    if (formData.MediaType?.value !== 'UserPC' && !formData.FileName?.value) {
      errors.FileName = t`Select a file.`
    } else if (formData.MediaType?.value === 'UserPC' && !formData.File) {
      errors.File = t`File is required.`
    }

    // If there are errors, display them and do not submit the form
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      // error_toast
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData: { [key: string]: any } = {
      MediaType: formData.MediaType?.value,
      NodeNos: JSON.stringify(NodeNo),
    }
    if (formData.MediaType?.value === 'UserPC') {
      modifiedFormData['File'] = formData.File
    }
    if (formData.MediaType?.value !== 'UserPC') {
      modifiedFormData['FileName'] = formData.FileName?.value
    }

    trigger(modifiedFormData)
  }

  return (
    <div className="w-full px-4 pt-4 bg-white rounded-md">
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <SwSyncForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
        />
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

export default SwSyncModal
