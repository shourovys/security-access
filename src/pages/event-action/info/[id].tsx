import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { eventActionApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ActionList from '../../../components/pages/eventAction/Action/ActionList'
import EventList from '../../../components/pages/eventAction/Event/EventList'
import EventActionForm from '../../../components/pages/eventAction/form/EventActionForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IEventActionFormData, IEventActionResult } from '../../../types/pages/eventAction'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a Event Action
function EventActionInfo() {
  const navigate = useNavigate()
  // Get the Event Action ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IEventActionFormData>({
    EventActionName: '',
    EventActionDesc: '',
    Partition: null,
    Schedule: null,
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the EventAction from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IEventActionResult>>(
    isDeleted || !queryId ? null : eventActionApi.details(queryId)
  )

  useEffect(() => {
    // Set the form data to the fetched data once it's available
    if (data) {
      const { EventActionName, EventActionDesc, Partition, Schedule } = data.data
      setFormData({
        EventActionName: EventActionName,
        EventActionDesc,
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Schedule: {
          value: Schedule.ScheduleNo.toString(),
          label: Schedule.ScheduleName,
        },
      })
    }
  }, [data])

  // Define the mutation function to delete the eventAction from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    eventActionApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to eventAction list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.eventAction.path(), { replace: true })
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
      link: routeProperty.eventActionEdit.path(queryId),
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
      link: routeProperty.eventAction.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <EventActionForm formData={formData} isLoading={isLoading} />
      </FormContainer>
      <div className="pt-4" />
      <FormContainer twoPart={false}>
        <EventList />
      </FormContainer>
      <div className="pt-4" />
      <FormContainer twoPart={false}>
        <ActionList />
      </FormContainer>
    </Page>
  )
}

export default EventActionInfo
