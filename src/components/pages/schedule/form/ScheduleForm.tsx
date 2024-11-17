import { holidayApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IHolidayResult } from '../../../../types/pages/holiday'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IScheduleFormData } from '../../../../types/pages/schedule'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: IScheduleFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function ScheduleForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: holidayIsLoading, data: holidayData } = useSWR<
    IListServerResponse<IHolidayResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : holidayApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={doorIcon} header={t`Schedule`}>
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
        name="ScheduleName"
        // placeholder="Schedule Name"
        label={t`Schedule Name `}
        value={formData?.ScheduleName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ScheduleName}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="ScheduleDesc"
        // placeholder="Description"
        label={t`Description`}
        value={formData?.ScheduleDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ScheduleDesc}
        isLoading={isLoading}
      />
      <Selector
        name="Holiday"
        label={t`Holiday`}
        value={formData?.Holiday}
        options={holidayData?.data.map((result) => ({
          value: result.HolidayNo.toString(),
          label: result.HolidayName,
        }))}
        isClearable={true}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Holiday}
        isLoading={isLoading || holidayIsLoading}
      />
    </FormCardWithHeader>
  )
}

export default ScheduleForm
