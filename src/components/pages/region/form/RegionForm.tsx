import { partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IRegionFormData } from '../../../../types/pages/region'
import { SERVER_QUERY } from '../../../../utils/config'
import { regionIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: IRegionFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function RegionForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={regionIcon} header={t`Region`}>
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
      <Input
        name="RegionName"
        label={t`Region Name `}
        value={formData?.RegionName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RegionName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="RegionDesc"
        label={t`Description`}
        value={formData?.RegionDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RegionDesc}
        isLoading={isLoading}
      />
      <SwitchButtonSelect
        name="OnlyMuster"
        label={t`Only Muster`}
        value={formData?.OnlyMuster}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default RegionForm
