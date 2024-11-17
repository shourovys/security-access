import { inputApi, nodeApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IInputResult } from '../../../../types/pages/input'
import { INodeResult } from '../../../../types/pages/node'
import {
  IOutputFormData,
  outputStatOptions,
  outputTypeOptions,
} from '../../../../types/pages/output'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: IOutputFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
  showNodeSelector?: boolean
}

function OutputForm({
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

  const { isLoading: inputIsLoading, data: inputData } = useSWR<
    IListServerResponse<IInputResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined' || formData?.FollowInput?.value === '0'
      ? null
      : inputApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.Node?.value}`)
  )

  return (
    <FormCardWithHeader icon={doorIcon} header={t`Output`} twoPart={false}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-3">
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
          name="OutputName"
          // placeholder="Output Name"
          label={t`Output Name `}
          value={formData?.OutputName}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.OutputName}
          isLoading={isLoading}
          required={false}
        />
        <Input
          name="OutputDesc"
          // placeholder="Description"
          label={t`Description`}
          value={formData?.OutputDesc}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.OutputDesc}
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
            required={true}
          />
        ) : (
          <Input
            name="NodeName"
            label={t`Node `}
            value={`${formData?.Node?.label} ${
              formData?.SubnodeName && '-' + formData?.SubnodeName
            }`}
            onChange={handleInputChange}
            isLoading={isLoading}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.NodeName}
          />
        )}
        <Input
          name="OutputPort"
          type="number"
          label={t`Output Port `}
          value={formData?.OutputPort}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.OutputPort}
          isLoading={isLoading}
        />
        <SwitchButtonSelect
          name="FollowInput"
          label={t`Follow Input`}
          value={formData?.FollowInput}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
        />
        {formData?.FollowInput?.value === '1' && (
          <Selector
            name="Input"
            label={t`Input`}
            value={formData?.Input}
            options={inputData?.data.map((result) => ({
              value: result.InputNo.toString(),
              label: result.InputName,
            }))}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Input}
            isLoading={isLoading || inputIsLoading}
          />
        )}
        <Selector
          name="OutputType"
          label={t`Output Type`}
          value={formData?.OutputType}
          options={outputTypeOptions}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.OutputType}
          isLoading={isLoading}
        />
        <Input
          name="OnTime"
          // placeholder="On Time"
          type="number"
          label={t`On Time (100ms) `}
          value={formData?.OnTime}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.OnTime}
          isLoading={isLoading}
        />
        <Input
          name="OffTime"
          type="number"
          label={t`Off Time (100ms) `}
          value={formData?.OffTime}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.OffTime}
          isLoading={isLoading}
        />
        <Input
          name="Repeat"
          type="number"
          label={t`Repeat `}
          value={formData?.Repeat}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Repeat}
          isLoading={isLoading}
        />
        <Selector
          name="OutputStat"
          label={t`Output Stat`}
          value={formData?.OutputStat}
          options={outputStatOptions}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.OutputStat}
          isLoading={isLoading}
        />
      </div>
    </FormCardWithHeader>
  )
}

export default OutputForm
