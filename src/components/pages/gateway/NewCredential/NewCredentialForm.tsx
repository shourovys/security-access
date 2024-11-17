import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { IGatewayNewCredentialFormData } from '../../../../types/pages/gateway'
import { credentialIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: IGatewayNewCredentialFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function NewCredentialForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={credentialIcon} header={t`New Credential`}>
      <Input
        name="UserId"
        label={t`User ID *`}
        value={formData?.UserId}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.UserId}
        isLoading={isLoading}
      />
      <Input
        name="Password"
        label={t`Password *`}
        value={formData?.Password}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Password}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default NewCredentialForm
