import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../../../api/swrConfig'
import { holidayItemApi } from '../../../../../api/urls'
import Page from '../../../../../components/HOC/Page'
import FormContainer from '../../../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../../../components/layout/Breadcrumbs'
import HolidayItemForm from '../../../../../components/pages/holiday/holidayItem/form/HolidayItemForm'
import useAlert from '../../../../../hooks/useAlert'
import routeProperty from '../../../../../routes/routeProperty'
import { IActionsButton } from '../../../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../../../types/pages/common'
import { IHolidayItemFormData, IHolidayItemResult } from '../../../../../types/pages/holidayItem'
import { deleteIcon, editIcon, listIcon } from '../../../../../utils/icons'
import t from '../../../../../utils/translator'

// Component to show details of a holiday item
function HolidayItemInfo() {
  const navigate = useNavigate()
  // Get the holiday ID from the router query
  const params = useParams()
  const holidayId = params.holidayId as string
  const holidayItemId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IHolidayItemFormData>({
    StartDate: '',
    EndDate: '',
    DateName: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Holiday from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IHolidayItemResult>>(
    isDeleted || !holidayItemId || !holidayId
      ? null
      : holidayItemApi.details(holidayId, holidayItemId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { DateName, StartDate, EndDate } = data.data
      setFormData({
        StartDate,
        EndDate,
        DateName,
      })
    }
  }, [data])

  // Define the mutation function to delete the holiday from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    holidayItemApi.delete(holidayId, holidayItemId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to holiday list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.holidayInfo.path(holidayId), { replace: true })
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
      link: routeProperty.holidayItemEdit.path(holidayId, holidayItemId),
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
      link: routeProperty.holidayInfo.path(holidayId),
    },
  ]

  const breadcrumbsPageRoutes = [
    {
      href: routeProperty.holiday.path(),
      text: t`Holiday`,
    },
    {
      href: routeProperty.holidayInfo.path(holidayId),
      text: t`Information`,
    },
    {
      href: routeProperty.holidayItemInfo.path(holidayId, holidayItemId),
      text: t`Item Info`,
    },
  ]

  return (
    <Page title={t`Info Holiday Item`}>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs
        pageTitle={t`Holiday Item`}
        pageRoutes={breadcrumbsPageRoutes}
        breadcrumbsActions={breadcrumbsActions}
      />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <HolidayItemForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default HolidayItemInfo
