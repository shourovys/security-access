import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { accessApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import { AccessDeviceFrom } from '../../../components/pages/access/form'
import AccessAccessFrom from '../../../components/pages/access/form/AccessFrom'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { IAccessInfoFormData, IAccessResult, accessDeviceTypes } from '../../../types/pages/access'
import { ISingleServerResponse, accessSelectOption } from '../../../types/pages/common'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a access
function AccessInfo() {
  const navigate = useNavigate()
  // Get the access ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IAccessInfoFormData>({
    Partition: null,
    AccessName: '',
    AccessDesc: '',
    Schedule: null,
    DeviceType: null,
    DeviceSelect: null,
    DeviceIds: [],
    GroupIds: [],
    Devices: [],
    Groups: [],
  })

  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the access from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IAccessResult>>(
    isDeleted || !queryId ? null : accessApi.details(queryId)
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
        DeviceType: findSelectOption(accessDeviceTypes, AccessType),
        Devices,
        Groups,
        AccessName,
        AccessDesc,
      })
    }
  }, [data])

  // Define the mutation function to delete the access from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    accessApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to access list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.access.path(), { replace: true })
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeleted(false)
      },
    }
  )
  // Define the function to call delete mutation with Alert Dialog
  const handleDelete = () => {
    const deleteMutation = () => {
      setIsDeleted(true)
      return deleteTrigger()
    }
    openAlertDialogWithPromise(deleteMutation, { success: t`Success` }, t`Do you want to Delete ?`)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.accessEdit.path(queryId),
    },
    {
      color: 'danger',
      icon: deleteIcon,
      text: t`Delete`,
      onClick: handleDelete,
      isLoading: deleteIsLoading,
    },
    {
      color: 'danger',
      icon: listIcon,
      text: t`List`,
      link: routeProperty.access.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <AccessAccessFrom formData={formData} isLoading={isLoading} />

        <AccessDeviceFrom formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default AccessInfo
