import useSWR from 'swr'
import { partitionApi, threatApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import MultipleCheckbox from '../../../../components/atomic/MultipleCheckbox'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange, THandleInputSelect } from '../../../../types/components/common'
import {
  IListServerResponse,
  INewFormErrors,
  ISelectedInputFields,
} from '../../../../types/pages/common'
// import { IElevatorResult } from 'types/pages/elevator'
import {
  IElevatorGroupEditFormData,
  elevatorThreatLevelOptions,
  readerTypeOptions,
} from '../../../../types/pages/elevator'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IThreatResult } from '../../../../types/pages/threat'
import { SERVER_QUERY } from '../../../../utils/config'
import { elevatorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: IElevatorGroupEditFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IElevatorGroupEditFormData>
  disabled?: boolean
  isLoading?: boolean
  // props for checkbox in header
  selectedFields?: ISelectedInputFields<IElevatorGroupEditFormData>
  handleSelect?: THandleInputSelect
}

function ElevatorGroupEditForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  selectedFields,
  handleSelect,
}: IProps) {
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: threatIsLoading, data: threatData } = useSWR<
    IListServerResponse<IThreatResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : threatApi.list(SERVER_QUERY.selectorDataQuery)
  )
  return (
    <FormCardWithHeader
      icon={elevatorIcon}
      header={t`Elevator`}
      isSelected={
        selectedFields?.Partition &&
        selectedFields?.ReaderType &&
        selectedFields?.ThreatLevel &&
        selectedFields?.Threat
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
        isSelected={selectedFields?.Partition}
        handleSelect={handleSelect}
      />
      <Selector
        name="ReaderType"
        label={t`Reader Type`}
        value={formData?.ReaderType}
        options={readerTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ReaderType}
        isLoading={isLoading}
        isSelected={selectedFields?.ReaderType}
        handleSelect={handleSelect}
      />

      <Selector
        name="Threat"
        label="Threat"
        value={formData?.Threat}
        options={threatData?.data.map((result) => ({
          value: result.ThreatNo.toString(),
          label: result.ThreatName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Threat}
        isLoading={isLoading || threatIsLoading}
        handleSelect={handleSelect}
      />

      <Selector
        name="ThreatLevel"
        label={t`Threat Level`}
        value={formData?.ThreatLevel}
        options={elevatorThreatLevelOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ThreatLevel}
        isLoading={isLoading}
        isSelected={selectedFields?.ThreatLevel}
        handleSelect={handleSelect}
      />
    </FormCardWithHeader>
  )
}

export default ElevatorGroupEditForm
