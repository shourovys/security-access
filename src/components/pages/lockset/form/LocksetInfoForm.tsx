import useSWR from 'swr'
import { gatewayApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IGatewayResult } from '../../../../types/pages/gateway'
import { ILocksetInfoFormData } from '../../../../types/pages/lockset'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { locksetIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: ILocksetInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function LocksetInfoForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: gatewayIsLoading, data: gatewayData } = useSWR<
    IListServerResponse<IGatewayResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : gatewayApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={locksetIcon} header={t`Device`}>
      <Selector
        name="Partition"
        label={t`Partition`}
        value={formData?.Partition}
        options={partitionData?.data.map((result) => ({
          value: result.PartitionNo.toString(),
          label: result.PartitionName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Partition}
        isLoading={isLoading || partitionIsLoading}
      />
      <Input
        name="LocksetName"
        label={t`Lockset Name`}
        value={formData?.LocksetName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.LocksetName}
        isLoading={isLoading}
      />

      <Input
        name="LocksetDesc"
        label={t`Description`}
        value={formData?.LocksetDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.LocksetDesc}
        isLoading={isLoading}
      />

      <Selector
        name="Gateway"
        label={t`Gateway`}
        value={formData?.Gateway}
        options={gatewayData?.data.map((result) => ({
          value: result.GatewayNo.toString(),
          label: result.GatewayName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Gateway}
        isLoading={isLoading || gatewayIsLoading}
        required={true}
      />

      <Input
        name="LinkId"
        label={t`Link ID`}
        value={formData?.LinkId}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.LinkId}
        isLoading={isLoading}
      />
      <Input
        name="Name"
        label={t`Name`}
        value={formData?.Name}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Name}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="Model"
        label={t`Model`}
        value={formData?.Model}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Model}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="DeviceId"
        label={t`Device ID`}
        value={formData?.DeviceId}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.DeviceId}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="Online"
        label={t`Online`}
        value={formData?.Online}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Online}
        isLoading={isLoading}
      />
      <Input
        name="Busy"
        label={t`Busy`}
        value={formData?.Busy}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Busy}
        isLoading={isLoading}
      />
      <Input
        name="LockStat"
        label={t`Lock Stat`}
        value={formData?.LockStat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.LockStat}
        isLoading={isLoading}
      />
      {/* <Input
        name="ContactStat"
        label={t`Contact Stat`}
        type="number"
        value={formData?.ContactStat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ContactStat}
        isLoading={isLoading}
      /> */}
    </FormCardWithHeader>
  )
}

export default LocksetInfoForm
