import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { INodeInfoFormData } from '../../../../types/pages/node'
import { nodeIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: INodeInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function NodeInfoForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={nodeIcon} header={t`Node`}>
      <Input
        name="NodeName"
        label={t`Node Name`}
        value={formData?.NodeName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.NodeName}
        isLoading={isLoading}
      />
      <Input
        name="NodeDesc"
        label={t`Description`}
        value={formData?.NodeDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.NodeDesc}
        isLoading={isLoading}
      />
      <Input
        name="Mac"
        label={t`MAC Address`}
        value={formData?.Mac}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Mac}
        isLoading={isLoading}
      />
      <Input
        name="Product"
        label={t`Product`}
        value={formData?.Product}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Product}
        isLoading={isLoading}
      />
      <Input
        name="Model"
        label={t`Model`}
        value={formData?.Model}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Model}
        isLoading={isLoading}
      />
      <Input
        name="Type"
        label={t`Type`}
        value={formData?.Type}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Type}
        isLoading={isLoading}
      />
      <Input
        name="OemNo"
        label={t`OEM`}
        value={formData?.Oem?.OemName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.OemNo}
        isLoading={isLoading}
      />
      <Input
        name="Version"
        label={t`Version`}
        value={formData?.Version ?? ''}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Version}
        isLoading={isLoading}
      />
      <Input
        name="Address"
        label={t`Address`}
        value={formData?.Address ?? ''}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Address}
        isLoading={isLoading}
      />
      <Input
        name="Timezone"
        label={t`Timezone`}
        value={formData?.Timezone ?? ''}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Timezone}
        isLoading={isLoading}
      />
      <Input
        name="Online"
        label={t`Online`}
        value={formData?.Online}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Online}
        isLoading={isLoading}
      />

      <Input
        name="PowerFaultType"
        label={t`Power Fault Type`}
        value={formData?.PowerFaultType}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.PowerFaultType}
        isLoading={isLoading}
      />
      <Input
        name="TamperType"
        label={t`Tamper Type`}
        value={formData?.TamperType}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.TamperType}
        isLoading={isLoading}
      />

      <Input
        name="PowerFaultStat"
        label={t`Power Fault Stat`}
        value={formData?.PowerFaultStat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.PowerFaultStat}
        isLoading={isLoading}
      />
      <Input
        name="TamperStat"
        label={t`Tamper Stat`}
        value={formData?.TamperStat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.TamperStat}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default NodeInfoForm
