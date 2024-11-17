import { sendPostRequest } from '../../api/swrConfig'
import { taskApi } from '../../api/urls'
import { AxiosError } from 'axios'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TaskFrom from '../../components/pages/task/form/TaskFrom'
import TaskItemFrom from '../../components/pages/task/form/TaskItemFrom'
import { useDefaultPartitionOption, useDefaultScheduleOption } from '../../hooks/useDefaultOption'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import { useState } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useNavigate } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputChange } from '../../types/components/common'
import {
  IFormErrors,
  IServerCommandErrorResponse,
  IServerErrorResponse,
  accessSelectOption,
  booleanSelectOption,
} from '../../types/pages/common'
import { ITaskFormData, taskActionControlsWithType, taskActionTypes } from '../../types/pages/task'
import { applyIcon, cancelIcon } from '../../utils/icons'
import scrollToErrorElement from '../../utils/scrollToErrorElement'
import { addSuccessfulToast } from '../../utils/toast'
import validateTaskFormData from '../../utils/validation/task'
import serverErrorHandler from '../../utils/serverErrorHandler'
import t from '../../utils/translator'

// Component to create a Task
function CreateTask() {
  const navigate = useNavigate()
  // Prompt the user before unloading the page if there are unsaved changes
  useBeforeunload(() => t('You will lose your changes!'))
  // Define state variables for the form data and form errors
  const [formData, setFormData] = useState<ITaskFormData>({
    Partition: null,
    TaskName: '',
    TaskDesc: '',
    StartOnly: booleanSelectOption[0],
    Schedule: null,
    ActionType: taskActionTypes[0],
    ActionCtrl: taskActionControlsWithType[taskActionTypes[0].value][0],
    ItemSelect: accessSelectOption[0],
    TaskItemIds: [],
    GroupItemIds: [],
  })
  const [formErrors, setFormErrors] = useStateWithCallback<IFormErrors>({}, scrollToErrorElement)

  // Set default Partition and Schedule
  useDefaultPartitionOption<ITaskFormData>(setFormData)
  useDefaultScheduleOption<ITaskFormData>(setFormData)

  // Update the form data when any input changes
  const handleInputChange: THandleInputChange = (name, value) => {
    setFormData((state) => ({ ...state, [name]: value }))
    setFormErrors({ ...formErrors, [name]: null })
  }

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(taskApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast()
      // redirect to schedule list page on success
      navigate(routeProperty.task.path())
    },
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      serverErrorHandler(error, setFormErrors)
    },
  })

  // Handle the form submission
  const handleSubmit = async () => {
    const errors = validateTaskFormData(formData)

    // If there are errors, display them and do not submit the form
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
      link: routeProperty.task.path(),
    },
  ]

  return (
    <Page>
      {/* Render the breadcrumbs bar with the defined actions */}
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer errorAlert={formErrors?.non_field_errors} twoPart={false}>
        <TaskFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
        <TaskItemFrom
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
        />
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button color="apply" size="large" onClick={handleSubmit} isLoading={isMutating}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel" link={routeProperty.task.path()}>
          <Icon icon={cancelIcon} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateTask
