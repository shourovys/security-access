import { partitionApi, scheduleApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IListServerResponse, INewFormErrors } from '../../../../types/pages/common'
import { IEventActionFormData } from '../../../../types/pages/eventAction'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IScheduleResult } from '../../../../types/pages/schedule'
import { SERVER_QUERY } from '../../../../utils/config'
import { eventActionIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: IEventActionFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IEventActionFormData>
  disabled?: boolean
  isLoading?: boolean
}

function EventActionForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
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

  return (
    <FormCardWithHeader icon={eventActionIcon} header={t`Event Action`}>
      {showPartition && (
        <Selector
          name="Partition"
          label={t`Partition`}
          value={formData?.Partition}
          options={partitionData?.data.map((result) => ({
            value: result.PartitionNo.toString(),
            label: result.PartitionName,
          }))}
          isClearable={false}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Partition}
          isLoading={isLoading || partitionIsLoading}
        />
      )}
      <Input
        name="EventActionName"
        // placeholder="Event Action Name"
        label={t`Event Action Name `}
        value={formData?.EventActionName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.EventActionName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="EventActionDesc"
        // placeholder="Description"
        label={t`Description`}
        value={formData?.EventActionDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.EventActionDesc}
        isLoading={isLoading}
      />
      <Selector
        name="Schedule"
        label={t`Schedule`}
        value={formData?.Schedule}
        options={scheduleData?.data.map((result) => ({
          value: result.ScheduleNo.toString(),
          label: result.ScheduleName,
        }))}
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Schedule}
        isLoading={isLoading || scheduleIsLoading}
      />
    </FormCardWithHeader>
  )
}

export default EventActionForm
