import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../../../api/swrConfig'
import { scheduleItemApi } from '../../../../../api/urls'
import Page from '../../../../../components/HOC/Page'
import FormContainer from '../../../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../../../components/layout/Breadcrumbs'
import ScheduleItemDateForm from '../../../../../components/pages/schedule/scheduleItem/form/ScheduleItemDateForm'
import ScheduleItemTimeForm from '../../../../../components/pages/schedule/scheduleItem/form/ScheduleItemTimeForm'
import useAlert from '../../../../../hooks/useAlert'
import routeProperty from '../../../../../routes/routeProperty'
import { IActionsButton } from '../../../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../../../types/pages/common'
import {
  IScheduleItemFormData,
  IScheduleItemResult,
  monthdayOptions,
  scheduleTimeTypeOptions,
  scheduleTypeOptions,
} from '../../../../../types/pages/scheduleItem'
import { findSelectOption } from '../../../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../../../utils/icons'
import { binaryToIndex } from '../../../../../utils/indexToBinary'
import t from '../../../../../utils/translator'

// Component to show details of a schedule item
function ScheduleItemInfo() {
  const navigate = useNavigate()
  // Get the schedule ID from the router query
  const params = useParams()
  const scheduleId = params.scheduleId as string
  const scheduleItemId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IScheduleItemFormData>({
    ScheduleType: null,
    Weekdays: undefined,
    Monthday: undefined,
    OneDate: undefined,
    TimeType: null,
    StartTime: undefined,
    EndTime: undefined,
    Latitude: '',
    Longitude: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Schedule from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IScheduleItemResult>>(
    isDeleted || !scheduleItemId || !scheduleId
      ? null
      : scheduleItemApi.details(scheduleId, scheduleItemId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        ScheduleType,
        Weekdays,
        Monthday,
        Latitude,
        Longitude,
        OneDate,
        TimeType,
        StartTime,
        EndTime,
      } = data.data
      setFormData({
        ScheduleType: findSelectOption(scheduleTypeOptions, ScheduleType),
        Weekdays: Weekdays ? binaryToIndex(Weekdays) : undefined,
        // Monthday: Monthday ? Monthday.toString() : undefined
        Monthday: findSelectOption(monthdayOptions, Monthday?.toString() || ''),
        OneDate: OneDate ? OneDate : undefined,
        TimeType: findSelectOption(scheduleTimeTypeOptions, TimeType),
        StartTime: StartTime ? StartTime : undefined,
        EndTime: EndTime ? EndTime : undefined,
        Latitude: Latitude.toString(),
        Longitude: Longitude.toString(),
      })
    }
  }, [data])

  // Define the mutation function to delete the schedule from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    scheduleItemApi.delete(scheduleId, scheduleItemId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to schedule list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.scheduleInfo.path(scheduleId), { replace: true })
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
    openAlertDialogWithPromise(deleteMutation, { success: t`Success` })
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: editIcon,
      text: t`Edit`,
      link: routeProperty.scheduleItemEdit.path(scheduleId, scheduleItemId),
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
      link: routeProperty.scheduleInfo.path(scheduleId),
    },
  ]

  const breadcrumbsPageRoutes = [
    {
      href: routeProperty.schedule.path(),
      text: t`Schedule`,
    },
    {
      href: routeProperty.scheduleInfo.path(scheduleId),
      text: t`Information`,
    },
    {
      href: routeProperty.scheduleItemInfo.path(scheduleId, scheduleItemId),
      text: t`Item Info`,
    },
  ]

  return (
    <Page title={t`Info Schedule Item`}>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        pageTitle={t`Schedule Item`}
        pageRoutes={breadcrumbsPageRoutes}
        breadcrumbsActions={breadcrumbsActions}
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <ScheduleItemDateForm formData={formData} isLoading={isLoading} />
        <ScheduleItemTimeForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default ScheduleItemInfo
