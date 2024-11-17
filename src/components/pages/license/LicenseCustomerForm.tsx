import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { ILicenseCustomerUpdateFormData } from '../../../types/pages/license'
import { licenseIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: ILicenseCustomerUpdateFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function LicenseCustomerForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={licenseIcon} header={t`Apply License Key`}>
      <Input
        name="FirstName"
        label={t`First Name`}
        value={formData?.FirstName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.FirstName}
        isLoading={isLoading}
      />
      <Input
        name="LastName"
        label={t`Last Name`}
        value={formData?.LastName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.LastName}
        isLoading={isLoading}
      />
      <Input
        name="Company"
        label={t`Company`}
        value={formData?.Company}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Company}
        isLoading={isLoading}
      />
      <Input
        name="Email"
        label={t`Email`}
        value={formData?.Email}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Email}
        isLoading={isLoading}
      />
      <Input
        name="Phone"
        label={t`Phone`}
        value={formData?.Phone}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Phone}
        isLoading={isLoading}
      />
      <Input
        name="Address"
        label={t`Address`}
        value={formData?.Address}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Address}
        isLoading={isLoading}
      />
      <Input
        name="InstallType"
        label={t`Install Type`}
        value={formData?.InstallType}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.InstallType}
        isLoading={isLoading}
      />
      <Input
        name="Suggestion"
        label={t`Suggestion`}
        value={formData?.Suggestion}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Suggestion}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default LicenseCustomerForm
