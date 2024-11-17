import { nodeApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IGatewayFormData } from '../../../../types/pages/gateway'
import { INodeResult } from '../../../../types/pages/node'
import { SERVER_QUERY } from '../../../../utils/config'
import { gatewayIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IGatewayFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function GatewayForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: nodeIsLoading, data: nodeData } = useSWR<IListServerResponse<INodeResult[]>>(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : nodeApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={gatewayIcon} header={t`Gateway`}>
      <Input
        name="GatewayName"
        label={t`Gateway Name `}
        value={formData?.GatewayName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.GatewayName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="GatewayDesc"
        label={t`Description`}
        value={formData?.GatewayDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.GatewayDesc}
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
        name="IpAddress"
        label={t`IP Address `}
        value={formData?.IpAddress}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.IpAddress}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="ApiPort"
        label={t`API Port `}
        type="number"
        value={formData?.ApiPort}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ApiPort}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="UserId"
        label={t`User ID `}
        value={formData?.UserId}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.UserId}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="Password"
        label={t`Password `}
        value={formData?.Password}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Password}
        isLoading={isLoading}
        required={true} // modified by Imran
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

export default GatewayForm
