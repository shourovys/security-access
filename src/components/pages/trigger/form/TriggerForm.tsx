import { partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IPartitionResult } from '../../../../types/pages/partition'
import { ITriggerFormData } from '../../../../types/pages/trigger'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: ITriggerFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function TriggerForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={doorIcon} header={t`Trigger`}>
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
          isLoading={partitionIsLoading}
        />
      )}
      <Input
        name="TriggerName"
        label={t`Trigger Name `}
        value={formData?.TriggerName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.TriggerName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="TriggerDesc"
        label={t`Description`}
        value={formData?.TriggerDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.TriggerDesc}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default TriggerForm
