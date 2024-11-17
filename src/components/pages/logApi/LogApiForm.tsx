import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { ILogApiFormData } from '../../../types/pages/logApi'
import { logAPIIcon } from '../../../utils/icons'

import SwitchButtonSelect from '../../../components/atomic/SelectSwitch'
import t from '../../../utils/translator'

interface IProps {
  formData?: ILogApiFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function LogApiForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={logAPIIcon} header={t`Log API Configuration`}>
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
          name="EndPoint"
          label={t`End Point `}
          value={formData?.EndPoint}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.EndPoint}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}

      {formData?.Enable?.value === '1' && (
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
      )}
      {formData?.Enable?.value === '1' && (
        <Input
          name="Password"
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
        <Input
          name="SiteId"
          label={t`Site ID `}
          value={formData?.SiteId}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.SiteId}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default LogApiForm
