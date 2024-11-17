import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { IMiscellaneousFormData } from '../../../types/pages/miscellaneous'
import { miscellaneousIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: IMiscellaneousFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function MiscellaneousDawnToDuskForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={miscellaneousIcon} header={t`Dawn To Dusk`}>
      <Input
        name="Latitude"
        // placeholder="Latitude"
        label={t`Latitude `}
        value={formData?.Latitude}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Latitude}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="Longitude"
        // placeholder="Longitude"
        label={t`Longitude `}
        value={formData?.Longitude}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Longitude}
        isLoading={isLoading}
        required={true}
      />
    </FormCardWithHeader>
  )
}

export default MiscellaneousDawnToDuskForm
