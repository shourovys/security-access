import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, booleanSelectOption } from '../../../../types/pages/common'
import { licenseNodeTypesOptions } from '../../../../types/pages/license'
import { INodeScanLicenseFormData } from '../../../../types/pages/nodeScan'
import { licenseIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: INodeScanLicenseFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function LicenseModalForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={licenseIcon} header={t`License`}>
      <Input
        name="Key"
        label={t`Key`}
        value={formData?.Key}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Key}
        isLoading={isLoading}
      />
      <Input
        name="Mac"
        label={t`MAC`}
        value={formData?.Mac}
        onChange={handleInputChange}
        disabled
        error={formErrors?.Mac}
        isLoading={isLoading}
      />
      <Input
        name="Product"
        label={t`Product`}
        value={formData?.Product}
        onChange={handleInputChange}
        disabled
        error={formErrors?.Product}
        isLoading={isLoading}
      />
      <Input
        name="Model"
        label={t`Model`}
        value={formData?.Model}
        onChange={handleInputChange}
        disabled
        error={formErrors?.Model}
        isLoading={isLoading}
      />
      {formData?.Type !== '0' && (
        <Input
          name="Type"
          label={t`Type`}
          value={formData?.Type}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Type}
          isLoading={isLoading}
        />
      )}
      <Selector
        name="NodeType"
        label={t`Node Type`}
        value={formData?.NodeType}
        options={licenseNodeTypesOptions}
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.NodeType}
        isLoading={isLoading}
      />
      <Selector
        name="Elevator"
        label={t`Elevator`}
        value={formData?.Elevator}
        options={booleanSelectOption}
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Elevator}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default LicenseModalForm
