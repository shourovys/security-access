import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import SwitchButtonSelect from '../../../components/atomic/SelectSwitch'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { INetworkFormData } from '../../../types/pages/network'
import { wifiIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: INetworkFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function NetworkWifiForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={wifiIcon} header={t`Wifi`}>
      <SwitchButtonSelect
        name="Wifi"
        label={t`WIFI`}
        value={formData?.Wifi}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.Wifi?.value === '1' && (
        <Input
          name="Ssid"
          type="text"
          label={t`SSID `}
          value={formData?.Ssid}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Ssid}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
      {formData?.Wifi?.value === '1' && (
        <Input
          name="SecuKey"
          type="password"
          label={t`Password `}
          value={formData?.SecuKey}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.SecuKey}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default NetworkWifiForm
