import { sendPostRequest } from '../../api/swrConfig'
import { accessApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import { AccessDeviceFrom } from '../../components/pages/access/form'
import AccessAccessFrom from '../../components/pages/access/form/AccessFrom'
import { useDefaultPartitionOption, useDefaultScheduleOption } from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import { IAccessFormData, accessDeviceTypes } from '../../types/pages/access'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  accessSelectOption,
} from '../../types/pages/common'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../utils/toast'
import validateAccessFormData from '../../utils/validation/access'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'
import useAuth from '../../hooks/useAuth'

// Component to create a Access
function CreateAccess() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))
  // const { showPartition } = useAuth()

  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<IAccessFormData>({
    Partition: null,
    AccessName: '',
    AccessDesc: '',
    Schedule: null,
    DeviceType: accessDeviceTypes[0],
    DeviceSelect: accessSelectOption[0],
    DeviceIds: [],
    GroupIds: [],
  })
  // console.log('🚀 ~ file: add.tsx:49 ~ CreateAccess ~ formData:', formData)
  // Set default Partition and Schedule
  useDefaultPartitionOption<IAccessFormData>(setFormData)
  useDefaultScheduleOption<IAccessFormData>(setFormData)

  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IAccessFormData>>(
    {},
    scrollToErrorElement
  )

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(accessApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to schedule list page on success
      navigate(routeProperty.access.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    const errors = validateAccessFormData(formData)

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
      PartitionNo: formData.Partition?.value,
      AccessName: formData.AccessName,
      AccessDesc: formData.AccessDesc,
      ScheduleNo: formData.Schedule?.value,
      AccessType: formData.DeviceType?.value,
      DeviceSelect: formData.DeviceSelect?.value,
      DeviceIds: formData.DeviceIds,
      GroupIds: formData.GroupIds,
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
      link: routeProperty.access.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} sameHeight twoPart={false}>
        <AccessAccessFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />

        <AccessDeviceFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.access.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateAccess
