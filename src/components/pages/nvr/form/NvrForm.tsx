import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { INvrFormData, nvrTypeOptions } from '../../../../types/pages/nvr'
import { nvrIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: INvrFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function NvrForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={nvrIcon} header={t`NVR`}>
      <Input
        name="NvrName"
        label={t`NVR Name `}
        value={formData?.NvrName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.NvrName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="NvrDesc"
        label={t`Description`}
        value={formData?.NvrDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.NvrDesc}
        isLoading={isLoading}
      />
      <Selector
        name="NvrType"
        label={t`NVR Type`}
        value={formData?.NvrType}
        options={nvrTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.NvrType}
        isLoading={isLoading}
      />
      <Input
        name="IpAddress"
        label={t`IP Address `}
        value={formData?.IpAddress}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.IpAddress}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="RtspPort"
        type="number"
        label={t`RTSP Port `}
        value={formData?.RtspPort}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RtspPort}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      {formData?.NvrType?.value === '0' && (
        <Input
          name="DataPort"
          type="number"
          label={t`Data Port`}
          value={formData?.DataPort}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.DataPort}
          isLoading={isLoading}
          required={true}
        />
      )}
      <Input
        name="UserId"
        label={t`User ID `}
        value={formData?.UserId}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.UserId}
        required={true} // modified by Imran
      />
      <Input
        name="Password"
        label={t`Password `}
        value={formData?.Password}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Password}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
    </FormCardWithHeader>
  )
}

export default NvrForm
