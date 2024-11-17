import { nodeApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { INodeResult } from '../../../../types/pages/node'
import { ISubnodeFormData, subnodeDeviceTypeOptions } from '../../../../types/pages/subnode'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: ISubnodeFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function SubnodeForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: nodeIsLoading, data: nodeData } = useSWR<IListServerResponse<INodeResult[]>>(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : nodeApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={doorIcon} header={t`Subnode`}>
      <Input
        name="SubnodeName"
        label={t`Subnode Name`}
        value={formData?.SubnodeName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.SubnodeName}
        isLoading={isLoading}
      />
      <Input
        name="SubnodeDesc"
        label={t`Description`}
        value={formData?.SubnodeDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.description}
        isLoading={isLoading}
      />
      <Selector
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
        required={true}
      />
      <Input
        name="Address"
        label={t`Address`}
        type="number"
        value={formData?.Address}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Address}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="Device"
        label={t`Device`}
        value={formData?.Device}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Device}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="Baudrate"
        label={t`Baudrate`}
        type="number"
        value={formData?.Baudrate}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Baudrate}
        isLoading={isLoading}
        required={true}
      />
      <Selector
        name="DeviceType"
        label={t`Device Type`}
        value={formData?.DeviceType}
        options={subnodeDeviceTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.DeviceType}
        isLoading={isLoading}
      />
      <Input
        name="PortCount"
        label={t`Port Count`}
        type="number"
        value={formData?.PortCount}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.PortCount}
        isLoading={isLoading}
        required={true}
      />
      {(disabled || typeof handleInputChange === 'undefined') && (
        <Input
          name="Online"
          label={t`Online`}
          value={formData?.Online}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Online}
          isLoading={isLoading}
        />
      )}
    </FormCardWithHeader>
  )
}

export default SubnodeForm
