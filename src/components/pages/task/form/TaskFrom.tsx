import { partitionApi, scheduleApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IScheduleResult } from '../../../../types/pages/schedule'
import {
  ITaskFormData,
  taskActionControlsWithType,
  taskActionTypes,
} from '../../../../types/pages/task'
import { SERVER_QUERY } from '../../../../utils/config'
import { taskIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useLicenseFilter from '../../../../hooks/useLicenseFilter'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData: ITaskFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function TaskForm({ formData, formErrors, handleInputChange, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: scheduleIsLoading, data: scheduleData } = useSWR<
    IListServerResponse<IScheduleResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : scheduleApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const handleTypeChange: THandleInputChange = (name, selectedValue) => {
    if (
      handleInputChange &&
      selectedValue &&
      typeof selectedValue === 'object' &&
      'value' in selectedValue
    ) {
      handleInputChange(name, selectedValue)
      handleInputChange('TaskItemIds', [])
      handleInputChange('GroupItemIds', [])
      handleInputChange('ActionCtrl', taskActionControlsWithType[selectedValue.value][0])
    }
  }

  const filteredTaskActionTypes = useLicenseFilter(taskActionTypes, {
    '10': 'Camera',
    '12': 'Lockset',
    '13': 'Facegate',
    '15': 'ContLock',
    '16': 'Intercom',
  })

  return (
    <FormCardWithHeader icon={taskIcon} header={t`Task`}>
      {showPartition && (
        <Selector
          name="Partition"
          label={t`Partition`}
          value={formData.Partition}
          options={partitionData?.data.map((result) => ({
            value: result.PartitionNo.toString(),
            label: result.PartitionName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading || partitionIsLoading}
          error={formErrors?.Partition}
        />
      )}
      <Input
        name="TaskName"
        // placeholder="Task Name"
        label={t`Task Name `}
        value={formData.TaskName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.TaskName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="TaskDesc"
        // placeholder="Description"
        label={t`Description`}
        value={formData.TaskDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.TaskDesc}
        isLoading={isLoading}
      />
      <Selector
        name="Schedule"
        label={t`Schedule`}
        value={formData.Schedule}
        options={scheduleData?.data.map((result) => ({
          value: result.ScheduleNo.toString(),
          label: result.ScheduleName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading || scheduleIsLoading}
        error={formErrors?.Schedule}
      />

      <Selector
        name="ActionType"
        label={t`Action Type`}
        value={formData.ActionType}
        options={filteredTaskActionTypes}
        onChange={handleTypeChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ActionType}
        isLoading={isLoading}
      />

      <SwitchButtonSelect
        name="StartOnly"
        label={t`Start Only`}
        value={formData.StartOnly}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />

      {formData.StartOnly?.value === '1' && (
        <Selector
          name="ActionCtrl"
          label={t`Action Control`}
          value={formData.ActionCtrl}
          options={
            formData.ActionType?.value ? taskActionControlsWithType[formData.ActionType?.value] : []
          }
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ActionCtrl}
          isLoading={isLoading}
        />
      )}
    </FormCardWithHeader>
  )
}

export default TaskForm
