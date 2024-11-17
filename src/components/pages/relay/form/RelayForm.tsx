import { elevatorApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IElevatorResult } from '../../../../types/pages/elevator'
import { IPartitionResult } from '../../../../types/pages/partition'
import {
  IRelayFormData,
  IRelayInfoFormData,
  relayStatOptions,
  relayTypeOptions,
} from '../../../../types/pages/relay'
import { SERVER_QUERY } from '../../../../utils/config'
import { relayIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: IRelayFormData | IRelayInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function RelayForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  // const { isLoading: nodeIsLoading, data: nodeData } = useSWR<IListServerResponse<INodeResult[]>>(
  //   disabled || typeof handleInputChange === 'undefined'
  //     ? null
  //     : nodeApi.list(SERVER_QUERY.selectorDataQuery)
  // )

  const { isLoading: elevatorIsLoading, data: elevatorData } = useSWR<
    IListServerResponse<IElevatorResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : elevatorApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.NodeNo}`)
  )

  return (
    <FormCardWithHeader icon={relayIcon} header={t`Relay`}>
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
        name="RelayName"
        label={t`Relay Name `}
        value={formData?.RelayName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RelayName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="RelayDesc"
        label={t`Description`}
        value={formData?.RelayDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RelayDesc}
        isLoading={isLoading}
      />
      {(disabled || typeof handleInputChange === 'undefined') &&
        formData &&
        'NodeName' in formData &&
        'SubnodeName' in formData && (
          <Input
            name="NodeName"
            label={t`Node Name`}
            value={`${formData?.NodeName} ${formData?.SubnodeName && '-' + formData?.SubnodeName}`}
            onChange={handleInputChange}
            isLoading={isLoading}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.NodeName}
          />
        )}
      {/* <Selector
        name="Node"
        label={t`Node`}
        value={formData?.Node}
        options={nodeData?.data.map((result) => ({
          value: result.NodeNo.toString(),
          label: result.NodeName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Node}
        isLoading={isLoading || nodeIsLoading}
      /> */}
      {/* <Input
        name="RelayPort"
        label={t`Port`}
        type="number"
        value={formData?.RelayPort}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RelayPort}
        isLoading={isLoading}
      /> */}
      <Selector
        name="Elevator"
        label={t`Elevator`}
        value={formData?.Elevator}
        options={elevatorData?.data.map((result) => ({
          value: result.ElevatorNo.toString(),
          label: result.ElevatorName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Elevator}
        isLoading={isLoading || elevatorIsLoading}
      />
      <Selector
        name="RelayType"
        label={t`Relay Type`}
        value={formData?.RelayType}
        options={relayTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RelayType}
        isLoading={isLoading}
      />
      <Input
        name="OnTime"
        label={t`On Time (100ms) `}
        type="number"
        value={formData?.OnTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.OnTime}
        isLoading={isLoading}
        required={true}
      />
      {/* <Input
        name="OffTime"
        label={t`Off Time (100ms) `}
        type="number"
        value={formData?.OffTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.OffTime}
        isLoading={isLoading}
        required={true} 
      />
      <Input
        name="Repeat"
        label={t`Repeat `}
        type="number"
        value={formData?.Repeat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Repeat}
        isLoading={isLoading}
        required={true} 
      /> */}
      {formData &&
        'RelayStat' in formData &&
        (disabled || typeof handleInputChange === 'undefined') && (
          <Selector
            name="RelayStat"
            label={t`Relay Stat`}
            value={formData?.RelayStat}
            options={relayStatOptions}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.RelayStat}
            isLoading={isLoading}
          />
        )}
    </FormCardWithHeader>
  )
}

export default RelayForm
