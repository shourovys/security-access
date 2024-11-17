import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendDeleteRequest } from '../../../api/swrConfig'
import { taskApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import TaskTaskFrom from '../../../components/pages/task/form/TaskFrom'
import TaskItemFrom from '../../../components/pages/task/form/TaskItemFrom'
import useAlert from '../../../hooks/useAlert'
import routeProperty from '../../../routes/routeProperty'
import { IActionsButton } from '../../../types/components/actionButtons'
import {
  ISingleServerResponse,
  accessSelectOption,
  booleanSelectOption,
} from '../../../types/pages/common'
import {
  ITaskInfoFormData,
  ITaskResult,
  taskActionControlsWithType,
  taskActionTypes,
} from '../../../types/pages/task'
import { findSelectOption } from '../../../utils/findSelectOption'
import { deleteIcon, editIcon, listIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

// Component to show details of a task
function TaskInfo() {
  const navigate = useNavigate()
  // Get the task ID from the router query
  const params = useParams()
  const queryId = params.id as string
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // Define the initial state of the form data and is data deleted
  const [formData, setFormData] = useState<ITaskInfoFormData>({
    Partition: null,
    TaskName: '',
    TaskDesc: '',
    StartOnly: null,
    Schedule: null,
    ActionType: null,
    ActionCtrl: null,
    ItemSelect: null,
    TaskItemIds: [],
    GroupItemIds: [],
    TaskItems: [],
    GroupItems: [],
  })
  const [isDeleted, setIsDeleted] = useState(false)

  // Fetch the details of the task from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ITaskResult>>(
    isDeleted || !queryId ? null : taskApi.details(queryId)
  )

  useEffect(() => {
    if (data) {
      // Set the form data to the fetched data once it's available
      const {
        Partition,
        Schedule,
        TaskItems,
        GroupItems,
        TaskName,
        TaskDesc,
        StartOnly,
        ItemSelect,
        ActionType,
        ActionCtrl,
      } = data.data

      setFormData({
        Partition: {
          value: Partition.PartitionNo.toString(),
          label: Partition.PartitionName,
        },
        Schedule: {
          value: Schedule.ScheduleNo.toString(),
          label: Schedule.ScheduleName,
        },
        TaskItemIds: TaskItems?.map((item) => item?.ItemNo.toString()) || [],
        GroupItemIds: GroupItems?.map((item) => item.GroupNo.toString()) || [],
        TaskItems: TaskItems ?? [],
        GroupItems: GroupItems ?? [],
        StartOnly: findSelectOption(booleanSelectOption, StartOnly),
        ItemSelect: findSelectOption(accessSelectOption, ItemSelect),
        ActionType: findSelectOption(taskActionTypes, ActionType),
        ActionCtrl: findSelectOption(taskActionControlsWithType[ActionType.toString()], ActionCtrl),
        TaskName,
        TaskDesc,
      })
    }
  }, [data])

  // Define the mutation function to delete the task from the server
  const { trigger: deleteTrigger, isMutating: deleteIsLoading } = useSWRMutation(
    taskApi.delete(queryId),
    sendDeleteRequest,
    {
      // Show a success message and redirect to task list page on successful delete
      onSuccess: () => {
        navigate(routeProperty.task.path(), { replace: true })
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
      link: routeProperty.taskEdit.path(queryId),
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
      link: routeProperty.task.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <TaskTaskFrom formData={formData} isLoading={isLoading} />
        <TaskItemFrom formData={formData} isLoading={isLoading} />
      </FormContainer>
    </Page>
  )
}

export default TaskInfo
