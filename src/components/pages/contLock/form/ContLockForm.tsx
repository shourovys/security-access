import { contGateApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IContGateResult } from '../../../../types/pages/contGate'
import { IContLockFormData, IContLockInfoFormData } from '../../../../types/pages/contLock'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: IContLockFormData | IContLockInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function ContLockForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )
  const { isLoading: contGateIsLoading, data: contGateData } = useSWR<
    IListServerResponse<IContGateResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : contGateApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const isInfoPage =
    (disabled || typeof handleInputChange === 'undefined') && formData && 'Online' in formData

  return (
    <FormCardWithHeader icon={doorIcon} header={t`ContLock`}>
      <Input
        name="ContLockName"
        label={t`ContLock Name `}
        value={formData?.ContLockName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ContLockName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="ContLockDesc"
        label={t`Description`}
        value={formData?.ContLockDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ContLockDesc}
        isLoading={isLoading}
      />
      {showPartition && (
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
      )}
      <Selector
        name="ContGate"
        label={t`ContGate `}
        value={formData?.ContGate}
        options={contGateData?.data.map((result) => ({
          value: result.ContGateNo.toString(),
          label: result.ContGateName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ContGate}
        isLoading={isLoading || contGateIsLoading}
        required={true} // modified by Imran
      />
      <Input
        name="RfAddress"
        label={t`RF Address `}
        type="number"
        value={formData?.RfAddress}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RfAddress}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="LockId"
        label={t`Lock ID `}
        value={formData?.LockId}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.LockId}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      {isInfoPage && (
        <Input
          name="Online"
          label={t`Online`}
          value={formData?.Online}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Online}
          isLoading={isLoading}
        />
      )}
      {isInfoPage && (
        <Input
          name="Busy"
          label={t`Busy`}
          value={formData?.Busy}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Busy}
          isLoading={isLoading}
        />
      )}
      {isInfoPage && (
        <Input
          name="LockStat"
          label={t`Lock Stat`}
          value={formData?.LockStat}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.LockStat}
          isLoading={isLoading}
        />
      )}
      {/* {isInfoPage && (
        <Input
          name="ContactStat"
          label={t`Contact Stat`}
          value={formData?.ContactStat}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ContactStat}
          isLoading={isLoading}
        />
      )} */}
    </FormCardWithHeader>
  )
}

export default ContLockForm
