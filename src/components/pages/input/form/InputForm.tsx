import { nodeApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IListServerResponse, INewFormErrors } from '../../../../types/pages/common'
import { IInputFormData, inputTypeOptions } from '../../../../types/pages/input'
import { INodeResult } from '../../../../types/pages/node'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: IInputFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IInputFormData>
  disabled?: boolean
  isLoading?: boolean
  showNodeSelector?: boolean
}

function InputForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  showNodeSelector,
}: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: nodeIsLoading, data: nodeData } = useSWR<IListServerResponse<INodeResult[]>>(
    disabled || typeof handleInputChange === 'undefined' || !showNodeSelector
      ? null
      : nodeApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={doorIcon} header={t`Input`}>
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
        name="InputName"
        label={t`Input Name `}
        value={formData?.InputName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.InputName}
        isLoading={isLoading}
        required={false} // modified by Imran
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
      {showNodeSelector ? (
        <Selector
          name="Node"
          label={t`Node `}
          value={formData?.Node}
          options={nodeData?.data.map((result) => ({
            value: result.NodeNo.toString(),
            label: result.NodeName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Node}
          isLoading={isLoading || nodeIsLoading}
          required={true} // modified by Imran
        />
      ) : (
        <Input
          name="NodeName"
          label={t`Node `}
          value={`${formData?.NodeName} ${formData?.SubnodeName && '-' + formData?.SubnodeName}`}
          onChange={handleInputChange}
          isLoading={isLoading}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.NodeName}
          required={false} // modified by Imran
        />
      )}
      <Input
        name="InputPort"
        type="number"
        label={t`Input Port `}
        value={formData?.InputPort}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.InputPort}
        isLoading={isLoading}
        required={false} // modified by Imran
      />
      <Selector
        name="InputType"
        label={t`Input Type`}
        value={formData?.InputType}
        options={inputTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.InputType}
        isLoading={isLoading}
      />
      <Selector
        name="InputStat"
        label={t`Input Stat`}
        value={formData?.InputStat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.InputStat}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default InputForm
