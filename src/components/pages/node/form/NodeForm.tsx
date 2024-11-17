import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { INodeFormData, nodeFaultTypeOptions } from '../../../../types/pages/node'
import { nodeIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: INodeFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function NodeForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={nodeIcon} header={t`Node`}>
      <Input
        name="NodeName"
        // placeholder="Node Name"
        label={t`Node Name `}
        value={formData?.NodeName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.NodeName}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="NodeDesc"
        // placeholder="Description"
        label={t`Description`}
        value={formData?.NodeDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.NodeDesc}
        isLoading={isLoading}
      />
      <Input
        name="Mac"
        // placeholder="MAC Address"
        label={t`MAC Address `}
        value={formData?.Mac}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Mac}
        isLoading={isLoading}
        required={true}
      />
      <Selector
        name="PowerFaultType"
        label={t`Power Fault Type`}
        value={formData?.PowerFaultType}
        options={nodeFaultTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.PowerFaultType}
        isLoading={isLoading}
      />
      <Selector
        name="TamperType"
        label={t`Tamper Type`}
        value={formData?.TamperType}
        options={nodeFaultTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.TamperType}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default NodeForm
