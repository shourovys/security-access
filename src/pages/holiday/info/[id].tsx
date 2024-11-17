import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { holidayApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import HolidayForm from '../../../components/pages/holiday/form/HolidayForm'
import HolidayItemList from '../../../components/pages/holiday/holidayItem/HolidayItemList'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IHolidayFormData, IHolidayResult } from '../../../types/pages/holiday'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a holiday
function HolidayInfo() {
  const navigate = useNavigate()
  // Get the holiday ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IHolidayFormData>({
    Partition: null,
    HolidayName: '',
    HolidayDesc: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Holiday from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IHolidayResult>>(
    isDeleted || !queryId ? null : holidayApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { Partition, HolidayName, HolidayDesc } = data.data
      setFormData({
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        HolidayName,
        HolidayDesc,
      })
    }
  }, [data])

  // Define the mutation function to delete the holiday from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    holidayApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to holiday list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.holiday.path(), { replace: true })
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
      link: routeProperty.holidayEdit.path(queryId),
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
      link: routeProperty.holiday.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <HolidayForm formData={formData} isLoading={isLoading} />
      </FormContainer>
      <div className="pt-3" />
      <FormContainer twoPart={false}>
        <HolidayItemList />
      </FormContainer>
    </Page>
  )
}

export default HolidayInfo
