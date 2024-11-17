import { partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IListServerResponse, INewFormErrors } from '../../../../types/pages/common'
import { IInputEditFormData, IInputFormData, inputTypeOptions } from '../../../../types/pages/input'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IInputEditFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IInputFormData>
  disabled?: boolean
  isLoading?: boolean
}

function InputEditForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )
  return (
    <FormCardWithHeader icon={doorIcon} header={t`Input`}>
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
        name="InputName"
        label={t`Input Name `}
        value={formData?.InputName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.InputName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="InputDesc"
        label={t`Description`}
        value={formData?.InputDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.InputDesc}
        isLoading={isLoading}
      />
      <Selector
        name="InputType"
        label={t`Type`}
        value={formData?.InputType}
        options={inputTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.InputType}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default InputEditForm
