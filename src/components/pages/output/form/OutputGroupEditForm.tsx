import { partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange, THandleInputSelect } from '../../../../types/components/common'
import {
  IListServerResponse,
  INewFormErrors,
  ISelectedInputFields,
} from '../../../../types/pages/common'
import { IOutputGroupEditFormData, outputTypeOptions } from '../../../../types/pages/output'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { outputIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: IOutputGroupEditFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IOutputGroupEditFormData>
  disabled?: boolean
  isLoading?: boolean
  // props for checkbox in header
  selectedOutputFields?: ISelectedInputFields<IOutputGroupEditFormData>
  handleSelect?: THandleInputSelect
}

function OutputGroupEditForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  selectedOutputFields,
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
      icon={outputIcon}
      header={t`Output`}
      isSelected={
        selectedOutputFields?.Partition &&
        selectedOutputFields?.OutputType &&
        selectedOutputFields?.OnTime &&
        selectedOutputFields?.OffTime &&
        selectedOutputFields?.Repeat
      }
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
        isSelected={selectedOutputFields?.Partition}
        handleSelect={handleSelect}
      />

      <Selector
        name="OutputType"
        label={t`Output Type`}
        options={outputTypeOptions}
        value={formData.OutputType}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.OutputType}
        isLoading={isLoading}
        isSelected={selectedOutputFields?.OutputType}
        handleSelect={handleSelect}
      />

      <Input
        name="OnTime"
        type="number"
        label={t`On Time(100ms)`}
        value={formData?.OnTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.OnTime}
        isLoading={isLoading}
        isSelected={selectedOutputFields?.OnTime}
        handleSelect={handleSelect}
      />
      <Input
        name="OffTime"
        type="number"
        label={t`Off Time(100ms)`}
        value={formData?.OffTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.OffTime}
        isLoading={isLoading}
        isSelected={selectedOutputFields?.OffTime}
        handleSelect={handleSelect}
      />
      <Input
        name="Repeat"
        type="number"
        label={t`Repeat`}
        value={formData?.Repeat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Repeat}
        isLoading={isLoading}
        isSelected={selectedOutputFields?.Repeat}
        handleSelect={handleSelect}
      />
    </FormCardWithHeader>
  )
}

export default OutputGroupEditForm
