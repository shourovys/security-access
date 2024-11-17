import { sendPostRequest } from '../../../../api/swrConfig'
import { nodeScanApi } from '../../../../api/urls'
import { AxiosError } from 'axios'
import FormActionButtonsContainer from '../../../../components/HOC/style/form/FormActionButtonsContainer'
import FormContainer from '../../../../components/HOC/style/form/FormContainer'
import Button from '../../../../components/atomic/Button'
import SystemEditFieldFrom from '../../../../components/pages/system/edit/SystemEditFieldFrom'
import useStateWithCallback from '../../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import useSWRMutation from 'swr/mutation'
import { THandleInputChange } from '../../../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
} from '../../../../types/pages/common'
import {
  INodeScanFormData,
  INodeScanSystemFormData,
  INodeScanSystemResult,
} from '../../../../types/pages/nodeScan'
import { systemMediaOptions } from '../../../../types/pages/system'
import { findSelectOption } from '../../../../utils/findSelectOption'
import Icon, { applyIcon, cancelIcon } from '../../../../utils/icons'
import scrollToErrorElement from '../../../../utils/scrollToErrorElement'
import { addSuccessfulToast, editSuccessfulToast } from '../../../../utils/toast'
import serverErrorHandler from '../../../../utils/serverErrorHandler'
import t from '../../../../utils/translator'

interface IProps {
  Macs: string[]
  loginInfo: INodeScanFormData
  systemData: INodeScanSystemResult | null
  isLoading?: boolean
  setOpenModal: (openModal: boolean) => void
}

const SystemModal = ({ Macs, loginInfo, systemData, isLoading, setOpenModal }: IProps) => {
  const navigate = useNavigate()

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<INodeScanSystemFormData>({
    Name: '',
    BackupMedia: null,
    RecordMedia: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (systemData) {
      const { Name, BackupMedia, RecordMedia } = systemData

      setFormData({
        Name,
        BackupMedia: findSelectOption(systemMediaOptions, BackupMedia),
        RecordMedia: findSelectOption(systemMediaOptions, RecordMedia),
      })
    }
  }, [systemData])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(nodeScanApi.setSystem, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast(`Success`)
      setOpenModal(false)
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors: IFormErrors = {}
    if (!formData.Name) {
      errors.Name = t`System Name is required`
    }
    if (!formData.BackupMedia?.label) {
      errors.BackupMedia = t`Backup Media is required`
    }
    if (!formData.RecordMedia?.label) {
      errors.RecordMedia = t`Record Media is required`
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
      Name: formData.Name,
      BackupMedia: formData.BackupMedia?.value,
      RecordMedia: formData.RecordMedia?.value,
    }

    trigger(modifiedFormData)
  }

  return (
    <div className="w-full px-4 pt-4 bg-white rounded-md">
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <SystemEditFieldFrom
          formData={formData}
          formErrors={formErrors}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
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

export default SystemModal
