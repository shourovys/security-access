import { sendPostRequest } from '../../../../api/swrConfig'
import { nodeApi, timeApi } from '../../../../api/urls'
import { AxiosError } from 'axios'
import FormActionButtonsContainer from '../../../../components/HOC/style/form/FormActionButtonsContainer'
import FormContainer from '../../../../components/HOC/style/form/FormContainer'
import Button from '../../../../components/atomic/Button'
import { useDefaultTimezoneOption } from '../../../../hooks/useDefaultOption'
import useStateWithCallback from '../../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { THandleInputChange } from '../../../../types/components/common'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  booleanSelectOption,
} from '../../../../types/pages/common'
import { INodeSetTimeFormData } from '../../../../types/pages/node'
import { ITimeResult } from '../../../../types/pages/time'
import { findSelectOptionOrDefault } from '../../../../utils/findSelectOption'
import Icon, { applyIcon, cancelIcon } from '../../../../utils/icons'
import scrollToErrorElement from '../../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../../utils/toast'
import serverErrorHandler from '../../../../utils/serverErrorHandler'
import t from '../../../../utils/translator'
import SetTimeForm from './SetTimeForm'

interface IProps {
  NodeNo: string[]
  setOpenModal: (openModal: boolean) => void
}

const SetTimeModal = ({ NodeNo, setOpenModal }: IProps) => {
  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<INodeSetTimeFormData>({
    Timezone: null,
    Ntp: null,
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<INodeSetTimeFormData>>(
    {},
    scrollToErrorElement
  )

  // setting default timezone value
  useDefaultTimezoneOption<INodeSetTimeFormData>(setFormData)

  // Fetch the details of the Time from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ITimeResult>>(timeApi.details)

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { Timezone, Ntp } = data.data
      setFormData({
        Timezone: Timezone
          ? {
              label: Timezone,
              value: Timezone,
            }
          : formData.Timezone,
        Ntp: findSelectOptionOrDefault(booleanSelectOption, Ntp),
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(nodeApi.setTime, sendPostRequest, {
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
    const errors: INewFormErrors<INodeSetTimeFormData> = {}

    if (!formData.Timezone?.value) {
      errors.Timezone = t`Timezone is required`
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
      TimeZones: formData.Timezone?.value,
      Ntp: Number(formData.Ntp?.value),
      NodeNos: NodeNo,
    }
    trigger(modifiedFormData)
  }

  return (
    <div className="w-full px-4 pt-4 bg-white rounded-md">
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <SetTimeForm
          formData={formData}
          isLoading={isLoading}
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

export default SetTimeModal
