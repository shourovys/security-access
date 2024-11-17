import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import SwitchButtonSelect from '../../../components/atomic/SelectSwitch'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { INetworkFormData } from '../../../types/pages/network'
import { cloudIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: INetworkFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function NetworkCloudForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={cloudIcon} header={t`Cloud`}>
      <SwitchButtonSelect
        name="Cloud"
        label={t`Cloud`}
        value={formData?.Cloud}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.Cloud?.value === '1' && (
        <Input
          name="CloudAddr"
          // placeholder='https://www.example.com'
          label={t`Cloud Address `}
          value={formData?.CloudAddr}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.CloudAddr}
          isLoading={isLoading}
          required={true}
        />
      )}
      {formData?.Cloud?.value === '1' && (
        <Input
          name="CloudPort"
          type="number"
          label={t`Cloud Port`}
          value={formData?.CloudPort}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.CloudPort}
          isLoading={isLoading}
        />
      )}
      {formData?.Cloud?.value === '1' && (
        <Input
          name="SiteNo"
          type="number"
          label={t`Site No `}
          value={formData?.SiteNo}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.SiteNo}
          isLoading={isLoading}
          required={true}
        />
      )}
      {formData?.Cloud?.value === '1' && (
        <Input
          name="SiteKey"
          // placeholder='Site Key'
          type="text"
          label={t`Site Key `}
          value={formData?.SiteKey}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.SiteKey}
          isLoading={isLoading}
          required={true}
        />
      )}
    </FormCardWithHeader>
  )
}

export default NetworkCloudForm
