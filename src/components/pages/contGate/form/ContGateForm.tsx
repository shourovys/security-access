import { nodeApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IContGateFormData, IContGateInfoFormData } from '../../../../types/pages/contGate'
import { INodeResult } from '../../../../types/pages/node'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IContGateFormData | IContGateInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function ContGateForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: nodeIsLoading, data: nodeData } = useSWR<IListServerResponse<INodeResult[]>>(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : nodeApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const isInfoPage =
    (disabled || typeof handleInputChange === 'undefined') && formData && 'Online' in formData

  return (
    <FormCardWithHeader icon={doorIcon} header={t`ContGate`}>
      <Input
        name="ContGateName"
        label={t`ContGate Name `}
        value={formData?.ContGateName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ContGateName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="ContGateDesc"
        label={t`Description`}
        value={formData?.ContGateDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ContGateDesc}
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
        name="MacAddress"
        label={t`MAC Address `}
        value={formData?.MacAddress}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.MacAddress}
        isLoading={isLoading}
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
        required={true}
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
        required={true}
      />
      <Input
        name="SecurityCode"
        label={t`Security Code`}
        value={formData?.SecurityCode}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.SecurityCode}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="RfChannel"
        label={t`Rf Channel `}
        type="number"
        value={formData?.RfChannel}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RfChannel}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="SyncCode"
        label={t`Sync Code `}
        value={formData?.SyncCode}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.SyncCode}
        isLoading={isLoading}
        required={true}
      />
      {isInfoPage && (
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
      {isInfoPage && (
        <Input
          name="Busy"
          label={t`Busy`}
          value={formData?.Busy}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Busy}
          isLoading={isLoading}
        />
      )}
    </FormCardWithHeader>
  )
}

export default ContGateForm
