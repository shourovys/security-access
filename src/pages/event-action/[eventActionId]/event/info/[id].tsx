// @ts-nocheck
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../../../api/swrConfig'
import { eventApi } from '../../../../../api/urls'
import Page from '../../../../../components/HOC/Page'
import FormContainer from '../../../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../../../components/layout/Breadcrumbs'
import EventForm from '../../../../../components/pages/eventAction/Event/form/EventForm'
import useAlert from '../../../../../hooks/useAlert'
import routeProperty from '../../../../../routes/routeProperty'
import { IActionsButton } from '../../../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../../../types/pages/common'
import {
  IEventFormData,
  IEventResult,
  eventActionEventTypesOptions,
} from '../../../../../types/pages/eventAndAction'
import { findSelectOption } from '../../../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../../../utils/icons'
import t from '../../../../../utils/translator'

// Component to show details of a eventAction item
function EventInfo() {
  const navigate = useNavigate()
  // Get the eventAction ID from the router query
  const params = useParams()
  const eventActionId = params.eventActionId as string
  const eventId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IEventFormData>({
    EventType: null,
    EventCodes: [],
    EventItemIds: [],
    EventNames: '',
    EventItemNames: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Holiday from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IEventResult>>(
    isDeleted || !eventId || !eventActionId ? null : eventApi.details(eventActionId, eventId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { EventWhats, EventType, EventItems } = data.data
      setFormData({
        EventType: findSelectOption(eventActionEventTypesOptions, EventType),
        EventCodes: EventWhats.map((event) => event.EventCodes.EventCode.toString()),
        EventNames: EventWhats.map((event) => event.EventCodes.EventName).join(', '),

        EventItemIds: EventItems.map((event) => event?.Items?.No),
        EventItemNames: EventItems.map((event) => event?.Items?.Name).join(', '),
      })
    }
  }, [data])

  // Define the mutation function to delete the eventAction from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    eventApi.delete(eventActionId, eventId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to eventAction list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.eventActionInfo.path(eventActionId), { replace: true })
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
      link: routeProperty.eventEdit.path(eventActionId, eventId),
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
      link: routeProperty.eventActionInfo.path(eventActionId),
    },
  ]

  const breadcrumbsPageRoutes = [
    {
      href: routeProperty.eventAction.path(),
      text: t`Event Action`,
    },
    {
      href: routeProperty.eventActionInfo.path(eventActionId),
      text: t`Information`,
    },
    {
      href: routeProperty.eventActionInfo.path(eventActionId, eventId),
      text: t`Event Info`,
    },
  ]

  return (
    <Page title={t`Info Event`}>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        pageTitle={t`Event Action`}
        pageRoutes={breadcrumbsPageRoutes}
        breadcrumbsActions={breadcrumbsActions}
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <EventForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default EventInfo
