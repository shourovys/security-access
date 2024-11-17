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
// import { IElevatorResult } from 'types/pages/elevator'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IRelayGroupEditFormData, relayTypeOptions } from '../../../../types/pages/relay'
import { SERVER_QUERY } from '../../../../utils/config'
import { relayIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: IRelayGroupEditFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IRelayGroupEditFormData>
  disabled?: boolean
  isLoading?: boolean
  // props for checkbox in header
  selectedFields?: ISelectedInputFields<IRelayGroupEditFormData>
  handleSelect?: THandleInputSelect
}

function RelayGroupEditForm({
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
  // const { isLoading: elevatorIsLoading, data: elevatorData } = useSWR<
  //   IListServerResponse<IElevatorResult[]>
  // >(
  //   disabled || typeof handleInputChange === 'undefined'
  //     ? null
  //     : elevatorApi.list(SERVER_QUERY.selectorDataQuery)
  // )

  return (
    <FormCardWithHeader
      icon={relayIcon}
      header={t`Relay`}
      isSelected={
        selectedFields?.Partition &&
        // selectedFields?.Elevator &&
        selectedFields?.RelayType &&
        selectedFields?.OnTime &&
        selectedFields?.OffTime &&
        selectedFields?.Repeat
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
      {/*
      <Selector
        name="Elevator"
        label={t`Elevator`}
        value={formData.Elevator}
        options={elevatorData?.data.map((result) => ({
          value: result.ElevatorNo.toString(),
          label: result.ElevatorName,
        }))}
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Elevator}
        isLoading={isLoading || elevatorIsLoading}
        isSelected={selectedFields?.Elevator}
        handleSelect={handleSelect}
      /> */}

      <Selector
        name="RelayType"
        label={t`Relay Type`}
        options={relayTypeOptions}
        value={formData.RelayType}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RelayType}
        isLoading={isLoading}
        isSelected={selectedFields?.RelayType}
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
        isSelected={selectedFields?.OnTime}
        handleSelect={handleSelect}
      />
      {/* <Input
        name="OffTime"
        type="number"
        label={t`Off Time(100ms)`}
        value={formData?.OffTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.OffTime}
        isLoading={isLoading}
        isSelected={selectedFields?.OffTime}
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
        isSelected={selectedFields?.Repeat}
        handleSelect={handleSelect}
      /> */}
    </FormCardWithHeader>
  )
}

export default RelayGroupEditForm
