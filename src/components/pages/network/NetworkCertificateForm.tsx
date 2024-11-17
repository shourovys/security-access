import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import SwitchButtonSelect from '../../../components/atomic/SelectSwitch'
import Selector from '../../../components/atomic/Selector'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { INetworkFormData, networkCountryOptions } from '../../../types/pages/network'
import { certificateIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: INetworkFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function NetworkCertificateForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={certificateIcon} header={t`Certificate`}>
      <SwitchButtonSelect
        name="SelfSigned"
        label={t`Self-Signed`}
        value={formData?.SelfSigned}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />

      {formData?.SelfSigned?.value === '1' && (
        <Selector
          name="Country"
          label={t`Country `}
          value={formData?.Country}
          options={networkCountryOptions}
          isSelected={false}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Country}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}

      {formData?.SelfSigned?.value === '1' && (
        <Input
          name="Organization"
          label={t`Organization `}
          value={formData?.Organization}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Organization}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}

      {formData?.SelfSigned?.value === '1' && (
        <Input
          name="Address2"
          label={t`Address 2`}
          value={formData?.Address2}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Address2}
          isLoading={isLoading}
        />
      )}

      {formData?.SelfSigned?.value === '1' && (
        <Input
          name="Address3"
          label={t`Address 3`}
          value={formData?.Address3}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Address3}
          isLoading={isLoading}
        />
      )}
    </FormCardWithHeader>
  )
}

export default NetworkCertificateForm
