import useSWR from 'swr'
import { partitionApi, readerApi, threatApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import MultipleCheckbox from '../../../../components/atomic/MultipleCheckbox'
import Selector from '../../../../components/atomic/Selector'
import useAuth from '../../../../hooks/useAuth'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import {
  IElevatorFormData,
  IElevatorInfoFormData,
  elevatorThreatLevelOptions,
  readerTypeOptions,
} from '../../../../types/pages/elevator'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IReaderResult } from '../../../../types/pages/reader'
import { IThreatResult } from '../../../../types/pages/threat'
import { SERVER_QUERY } from '../../../../utils/config'
import { elevatorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IElevatorFormData | IElevatorInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function ElevatorForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: threatIsLoading, data: threatData } = useSWR<
    IListServerResponse<IThreatResult[]>
  >(threatApi.list(SERVER_QUERY.selectorDataQuery))

  const { isLoading: readerIsLoading, data: readerData } = useSWR<
    IListServerResponse<IReaderResult[]>
  >(
    (disabled || typeof handleInputChange === 'undefined') &&
      formData?.SubnodeNo &&
      formData?.SubnodeNo !== '0'
      ? null
      : readerApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.NodeNo}`)
  )

  return (
    <FormCardWithHeader icon={elevatorIcon} header={t`Elevator`}>
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
        name="ElevatorName"
        label={t`Elevator Name `}
        value={formData?.ElevatorName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ElevatorName}
        isLoading={isLoading}
        required={true}
      />

      <Input
        name="ElevatorDesc"
        label={t`Description`}
        value={formData?.ElevatorDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ElevatorDesc}
        isLoading={isLoading}
      />
      {(disabled || typeof handleInputChange === 'undefined') &&
        formData &&
        'NodeName' in formData &&
        'SubnodeName' in formData && (
          <Input
            name="NodeName"
            label={t`Node`}
            value={`${formData?.NodeName} ${formData?.SubnodeName && '-' + formData?.SubnodeName}`}
            onChange={handleInputChange}
            isLoading={isLoading}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.NodeName}
          />
        )}
      {formData &&
        'ElevatorPort' in formData &&
        (disabled || typeof handleInputChange === 'undefined') && (
          <Input
            name="ElevatorPort"
            label={t`Elevator Port`}
            value={formData?.ElevatorPort}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.ElevatorPort}
            isLoading={isLoading}
          />
        )}

      <Selector
        name="ReaderType"
        label={t`Reader Type`}
        value={formData?.ReaderType}
        options={readerTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ReaderType}
        isLoading={isLoading}
      />

      {formData?.SubnodeNo === '0' && readerData?.data?.length ? (
        <Selector
          name="Reader"
          label={t`In Reader`}
          value={formData?.Reader}
          onChange={handleInputChange}
          options={readerData?.data.map((result) => ({
            value: result.ReaderNo.toString(),
            label: result.ReaderName,
          }))}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Reader}
          isLoading={isLoading || readerIsLoading}
        />
      ) : null}

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
      />

      {formData &&
        'ElevatorStat' in formData &&
        (disabled || typeof handleInputChange === 'undefined') && (
          <Input
            name="ElevatorStat"
            label={t`Elevator Stat`}
            value={typeof formData?.ElevatorStat === 'string' ? formData?.ElevatorStat : ''}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.ElevatorStat}
            isLoading={isLoading}
          />
        )}
    </FormCardWithHeader>
  )
}

export default ElevatorForm
