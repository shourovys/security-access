import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import Selector from '../../../components/atomic/Selector'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors, booleanSelectOption } from '../../../types/pages/common'
import { ILicenseFormData, licenseNodeTypesOptions } from '../../../types/pages/license'
import { doorIcon } from '../../../utils/icons'
import FormCardInputTwoPart from '../../HOC/style/form/FormCardInputTwoPart'
import t from '../../../utils/translator'

interface IProps {
  formData?: ILicenseFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function LicenseForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={doorIcon} header={t`License`} twoPart={false}>
      <Input
        name="Key"
        // placeholder="License Key"
        label={t`Key `}
        value={formData?.Key}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Key}
        isLoading={isLoading}
        required={true} // modified by Imran
      />

      <FormCardInputTwoPart>
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
      </FormCardInputTwoPart>
    </FormCardWithHeader>
  )
}

export default LicenseForm
