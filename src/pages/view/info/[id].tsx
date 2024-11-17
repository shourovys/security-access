import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { viewApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ViewForm from '../../../components/pages/view/form/ViewForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IViewFormData, IViewResult } from '../../../types/pages/view'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a view
function ViewInfo() {
  const navigate = useNavigate()
  // Get the view ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IViewFormData>({
    ViewName: '',
    ViewDesc: '',
    Partition: null,
    ChannelNos: [],
    Channels: [],
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the View from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IViewResult>>(
    isDeleted || !queryId ? null : viewApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { ViewName, ViewDesc, Partition, Channels } = data.data

      setFormData({
        ViewName,
        ViewDesc,
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        ChannelNos: Channels.map((channel) => channel.ChannelNo.toString()),
        Channels,
      })
    }
  }, [data])

  // Define the mutation function to delete the view from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    viewApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to view list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.view.path(), { replace: true })
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
      link: routeProperty.viewEdit.path(queryId),
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
      link: routeProperty.view.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <ViewForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default ViewInfo
