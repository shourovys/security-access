import { sendPutRequest } from '../../../api/swrConfig'
import { accessApi } from '../../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import { AccessDeviceFrom } from '../../../components/pages/access/form'
import AccessAccessFrom from '../../../components/pages/access/form/AccessFrom'
import useStateWithCallback from '../../../hooks/useStateWithCallback'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import { IAccessFormData, IAccessResult, accessDeviceTypes } from '../../../types/pages/access'
import {
  INewFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
  accessSelectOption,
} from '../../../types/pages/common'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import scrollToErrorElement from '../../../utils/scrollToErrorElement'
import { editSuccessfulToast } from '../../../utils/toast'
import validateAccessFormData from '../../../utils/validation/access'
import serverErrorHandler from '../../../utils/serverErrorHandler'
import t from '../../../utils/translator'
import useLicenseFilter from '../../../hooks/useLicenseFilter'

// Component to edit a Access
function EditAccess() {
  const navigate = useNavigate()
  // Get the access ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  const filteredAccessDeviceTypes = useLicenseFilter(accessDeviceTypes, {
    '12': 'Lockset',
    '13': 'Facegate',
    '17': 'ContLock',
    '18': 'Intercom',
  })

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<IAccessFormData>({
    Partition: null,
    AccessName: '',
    AccessDesc: '',
    Schedule: null,
    DeviceType: null,
    DeviceSelect: null,
    DeviceIds: [],
    GroupIds: [],
  })
  const [formErrors, setFormErrors] = useStateWithCallback<INewFormErrors<IAccessFormData>>(
    {},
    scrollToErrorElement
  )

  // Fetch the details of the Access from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IAccessResult>>(
    queryId ? accessApi.details(queryId) : null
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        Partition,
        Schedule,
        Devices,
        Groups,
        AccessName,
        AccessDesc,
        DeviceSelect,
        AccessType,
      } = data.data

      setFormData({
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Schedule: Schedule?.ScheduleNo
          ? {
              value: Schedule.ScheduleNo.toString(),
              label: Schedule.ScheduleName,
            }
          : null,
        DeviceIds: Devices?.map((item) => item?.No.toString()) || [],
        GroupIds: Groups?.map((item) => item.GroupNo.toString()) || [],
        DeviceSelect: findSelectOption(accessSelectOption, DeviceSelect),
        DeviceType: findSelectOption(filteredAccessDeviceTypes, AccessType),
        AccessName,
        AccessDesc,
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(accessApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.accessInfo.path(queryId))
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateAccessFormData(formData)

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
      link: routeProperty.accessInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <AccessAccessFrom
          formData={formData}
          isLoading={isLoading}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />

        <AccessDeviceFrom
          formData={formData}
          isLoading={isLoading}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.accessInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditAccess
