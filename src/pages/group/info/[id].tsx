import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { groupApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import GroupForm from '../../../components/pages/group/form/GroupForm'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import { ISingleServerResponse } from '../../../types/pages/common'
import { IGroupInfoFormData, IGroupResult, groupTypesOptions } from '../../../types/pages/group'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a group
function GroupInfo() {
  const navigate = useNavigate()
  // Get the group ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<IGroupInfoFormData>({
    GroupName: '',
    GroupDesc: '',
    Partition: null,
    GroupType: null,
    GroupItemIds: [],
    GroupItems: '',
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the Group from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<IGroupResult>>(
    isDeleted || !queryId ? null : groupApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const { GroupName, GroupDesc, Partition, GroupType, GroupItems } = data.data

      const savedPartition = {
        value: Partition.PartitionNo.toString(),
        label: Partition.PartitionName,
      }
      const savedGroupType = findSelectOption(groupTypesOptions, GroupType)

      setFormData({
        GroupName,
        GroupDesc,
        Partition: savedPartition,
        GroupType: savedGroupType,
        GroupItemIds: GroupItems.map((groupItem) => groupItem.Items.No.toString()),
        GroupItems: GroupItems.map((groupItem) => groupItem.Items.Name).join(', '),
      })
    }
  }, [data])

  // Define the mutation function to delete the group from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    groupApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to group list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.group.path(), { replace: true })
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
      link: routeProperty.groupEdit.path(queryId),
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
      link: routeProperty.group.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <GroupForm formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default GroupInfo
