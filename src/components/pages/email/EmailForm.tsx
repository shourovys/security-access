import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import SwitchButtonSelect from '../../../components/atomic/SelectSwitch'
import { THandleInputChange } from '../../../types/components/common'
import { INewFormErrors } from '../../../types/pages/common'
import { IEmailFormData } from '../../../types/pages/email'
import { emailIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: IEmailFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IEmailFormData>
  disabled?: boolean
  isLoading?: boolean
}

function EmailForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={emailIcon} header={t`Email Configuration`}>
      <SwitchButtonSelect
        name="Enable"
        label={t`Enable`}
        value={formData?.Enable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.Enable?.value === '1' && (
        <Input
          name="ServerAddr"
          // placeholder="https://www.example.com"
          label={t`Server Address`}
          value={formData?.ServerAddr}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ServerAddr}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
      {formData?.Enable?.value === '1' && (
        <Input
          name="ServerPort"
          // placeholder="Server Port"
          label={t`Server Port `}
          type="number"
          value={formData?.ServerPort}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ServerPort}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
      {formData?.Enable?.value === '1' && (
        <Input
          name="UserId"
          // placeholder="User ID"
          label={t`User ID `}
          value={formData?.UserId}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.UserId}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
      {formData?.Enable?.value === '1' && (
        <Input
          name="Password"
          // placeholder="Password"
          type="password"
          label={t`Password `}
          value={formData?.Password}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Password}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
      {formData?.Enable?.value === '1' && (
        <SwitchButtonSelect
          name="Tls"
          label={t`TLS`}
          value={formData?.Tls}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
        />
      )}
      {formData?.Enable?.value === '1' && (
        <Input
          name="Sender"
          // placeholder="Sender Email"
          label={t`Sender `}
          value={formData?.Sender}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Sender}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
      {formData?.Enable?.value === '1' && (
        <Input
          name="Receiver"
          // placeholder="Receiver Email"
          label={t`Receiver `}
          value={formData?.Receiver}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Receiver}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default EmailForm
