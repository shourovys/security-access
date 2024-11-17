import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { partitionApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import PartitionForm from '../../../components/pages/partition/form/PartitionForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IPartitionFormData } from '../../../types/pages/partition'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a partition
function PartitionInfo() {
  const navigate = useNavigate()
  // Get the schedule ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Partition from the server
  const { isLoading, data: formData } = useSWR<ISingleServerResponse<IPartitionFormData>>(
    isDeleted || !queryId ? null : partitionApi.details(queryId)
  )

  // Define the mutation function to delete the partition from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    partitionApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to partition list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.partition.path(), { replace: true })
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeleted(false)
      },
    }
  )

  const token = sessionStorage.getItem('accessToken')

  // Define the function to call delete mutation with Alert Dialog
  const handleDelete = async () => {
    const deleteMutation = () => {
      setIsDeleted(true)
      return deleteTrigger()
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users/partitions/${queryId}/details/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = await res.json()
    // console.log(data, '------');

    const messages = []

    let isNoRelatedEntities = false

    for (const key in data) {
      if (data[key] === '') {
        isNoRelatedEntities = true
        break
      } else if (data[key] !== undefined && data[key] !== 0) {
        messages.push(`${data[key]}`)
      }
    }

    let myMessage
    if (isNoRelatedEntities) {
      myMessage = (
        <div>
          <p>Do you want to Delete?</p>
        </div>
      )
    } else {
      const tableRows = messages.map((message, index) => (
        <tr key={index}>
          <td>{message}</td>
        </tr>
      ))

      myMessage = (
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-lg">If you Delete this, the followings also:</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
            <tfoot>
              <tr>
                <td className="">Do you want to Delete?</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )
    }

    openAlertDialogWithPromise(deleteMutation, { success: t`Success` }, myMessage as any)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] =
    queryId === '0'
      ? [
          {
            color: 'danger',
            icon: editIcon,
            text: t`Edit`,
            link: routeProperty.partitionEdit.path(queryId),
          },

          {
            color: 'danger',
            icon: listIcon,
            text: t`List`,
            link: routeProperty.partition.path(),
          },
        ]
      : [
          {
            color: 'danger',
            icon: editIcon,
            text: t`Edit`,
            link: routeProperty.partitionEdit.path(queryId),
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
            link: routeProperty.partition.path(),
          },
        ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <PartitionForm formData={formData?.data} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default PartitionInfo
