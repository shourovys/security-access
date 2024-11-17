import { sendPutRequest } from '../../../api/swrConfig'
import { taskApi } from '../../../api/urls'
import Page from '../../../components/HOC/Page'
import FormContainer from '../../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import TaskTaskFrom from '../../../components/pages/task/form/TaskFrom'
import TaskItemFrom from '../../../components/pages/task/form/TaskItemFrom'
import { useEffect, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../../types/components/actionButtons'
import { THandleInputChange } from '../../../types/components/common'
import {
  INewFormErrors,
  ISingleServerResponse,
  accessSelectOption,
  booleanSelectOption,
} from '../../../types/pages/common'
import {
  ITaskFormData,
  ITaskResult,
  taskActionControlsWithType,
  taskActionTypes,
} from '../../../types/pages/task'
import { findSelectOption } from '../../../utils/findSelectOption'
import { applyIcon, cancelIcon } from '../../../utils/icons'
import { editSuccessfulToast } from '../../../utils/toast'
import t from '../../../utils/translator'
import validateTaskFormData from '../../../utils/validation/task'
import useLicenseFilter from '../../../hooks/useLicenseFilter'

// Component to edit a Task
function EditTask() {
  const navigate = useNavigate()
  // Get the task ID from the router query
  const params = useParams()
  const queryId = params.id as string

  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))

  const filteredTaskActionTypes = useLicenseFilter(taskActionTypes, {
    '10': 'Camera',
    '12': 'Lockset',
    '13': 'Facegate',
    '15': 'ContLock',
    '16': 'Intercom',
  })

  // Define the initial state of the form data and form errors
  const [formData, setFormData] = useState<ITaskFormData>({
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
  })
  const [formErrors, setFormErrors] = useState<INewFormErrors<ITaskFormData>>({})

  // Fetch the details of the Task from the server
  const { isLoading, data } = useSWR<ISingleServerResponse<ITaskResult>>(
    queryId ? taskApi.details(queryId) : null
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
        StartOnly: findSelectOption(booleanSelectOption, StartOnly),
        ItemSelect: findSelectOption(accessSelectOption, ItemSelect),
        ActionType: findSelectOption(filteredTaskActionTypes, ActionType),
        ActionCtrl: findSelectOption(taskActionControlsWithType[ActionType.toString()], ActionCtrl),
        TaskName,
        TaskDesc,
      })
    }
  }, [data])

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors((state) => ({ ...state, [name]: null }))
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(taskApi.edit(queryId), sendPutRequest, {
    onSuccess: () => {
      editSuccessfulToast()
      navigate(routeProperty.taskInfo.path(queryId))
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    // Validate the form data
    const errors = validateTaskFormData(formData)

    if (Object.keys(errors).length) {
      setFormErrors(errors)
      //Object.entries(errors).forEach(([, value]) => {
      //   if (value) {
      //     errorToast(value)
      //   }
      // })
      return
    }

    // Modify form data to match API requirements and trigger the mutation
    const modifiedFormData = {
      PartitionNo: formData.Partition?.value,
      TaskName: formData.TaskName,
      TaskDesc: formData.TaskDesc,
      StartOnly: formData.StartOnly?.value,
      ScheduleNo: formData.Schedule?.value,
      ActionType: formData.ActionType?.value,
      ...(formData.StartOnly?.value === '1' && {
        ActionCtrl: formData.ActionCtrl?.value,
      }),
      ...(formData.StartOnly?.value === '0' && {
        ActionCtrl: 0,
      }),
      ItemSelect: formData.ItemSelect?.value,
      ...(formData.ItemSelect?.value === '0' && {
        TaskItemIds: formData.TaskItemIds,
        GroupItemIds: [],
      }),
      ...(formData.ItemSelect?.value === '1' && {
        TaskItemIds: [],
        GroupItemIds: formData.GroupItemIds,
      }),
    }

    trigger(modifiedFormData)
  }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActionsButtons: IActionsButton[] = [
    {
      color: 'apply',
      icon: applyIcon,
      text: t`Apply`,
      onClick: handleSubmit,
      isLoading: isMutating,
    },
    {
      color: 'cancel',
      icon: cancelIcon,
      text: t`Cancel`,
      link: routeProperty.taskInfo.path(queryId),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <TaskTaskFrom
          formData={formData}
          isLoading={isLoading}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
        <TaskItemFrom
          formData={formData}
          isLoading={isLoading}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.taskInfo.path(queryId)}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default EditTask
