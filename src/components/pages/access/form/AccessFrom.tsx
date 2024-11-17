import { partitionApi, scheduleApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector, { TSelectValue } from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { accessDeviceTypes, IAccessFormData } from '../../../../types/pages/access'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IScheduleResult } from '../../../../types/pages/schedule'
import { SERVER_QUERY } from '../../../../utils/config'
import { accessIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useLicenseFilter from '../../../../hooks/useLicenseFilter'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData: IAccessFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function AccessAccessFrom({
  formData,
  formErrors,
  handleInputChange,
  disabled,
  isLoading,
}: IProps) {
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

  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('DeviceIds', [])
      handleInputChange('GroupIds', [])
    }
  }

  const filteredAccessDeviceTypes = useLicenseFilter(accessDeviceTypes, {
    '12': 'Lockset',
    '13': 'Facegate',
    '17': 'ContLock',
    '18': 'Intercom',
  })

  return (
    <FormCardWithHeader icon={accessIcon} header={t`Access`}>
      {showPartition && (
        <Selector
          name="Partition"
          label={t`Partition`}
          value={formData.Partition}
          options={partitionData?.data.map((result) => ({
            value: result.PartitionNo.toString(),
            label: result.PartitionName,
          }))}
          isClearable={false}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading || partitionIsLoading}
          error={formErrors?.Partition}
        />
      )}
      <Input
        name="AccessName"
        label={t`Access Name `}
        // placeholder="Access Name"
        value={formData.AccessName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.AccessName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="AccessDesc"
        label={t`Description`}
        value={formData.AccessDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.AccessDesc}
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
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading || scheduleIsLoading}
        error={formErrors?.Schedule}
      />
      <Selector
        name="DeviceType"
        label={t`Access Type`}
        value={formData.DeviceType}
        options={filteredAccessDeviceTypes}
        isClearable={false}
        onChange={handleTypeChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.DeviceType}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default AccessAccessFrom
