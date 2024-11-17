import { partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange, THandleInputSelect } from '../../../../types/components/common'
import {
  IListServerResponse,
  INewFormErrors,
  ISelectedInputFields,
} from '../../../../types/pages/common'
import {
  IInputFormData,
  IInputGroupEditFormData,
  inputTypeOptions,
} from '../../../../types/pages/input'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { inputIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: IInputGroupEditFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IInputFormData>
  disabled?: boolean
  isLoading?: boolean
  // props for checkbox in header
  selectedInputFields?: ISelectedInputFields<IInputFormData>
  handleSelect?: THandleInputSelect
}

function InputGroupEditForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  selectedInputFields,
  handleSelect,
}: IProps) {
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader
      icon={inputIcon}
      header={t`Input`}
      isSelected={selectedInputFields?.Partition && selectedInputFields?.InputType}
      handleSelect={handleSelect}
    >
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
        error={formErrors?.Partition}
        isLoading={isLoading || partitionIsLoading}
        isSelected={selectedInputFields?.Partition}
        handleSelect={handleSelect}
      />

      <Selector
        name="InputType"
        label={t`Input Type`}
        options={inputTypeOptions}
        value={formData.InputType}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.InputType}
        isLoading={isLoading}
        isSelected={selectedInputFields?.InputType}
        handleSelect={handleSelect}
      />
    </FormCardWithHeader>
  )
}

export default InputGroupEditForm
