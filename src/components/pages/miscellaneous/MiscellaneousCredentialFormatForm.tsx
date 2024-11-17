import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Selector from '../../../components/atomic/Selector'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { IMiscellaneousFormData, bigEndianOptions } from '../../../types/pages/miscellaneous'
import { miscellaneousIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: IMiscellaneousFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function MiscellaneousCredentialFormatForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={miscellaneousIcon} header={t`Credential Format`}>
      <Selector
        name="BigEndian32"
        label={t`32 Bit Format`}
        value={formData?.BigEndian32}
        options={bigEndianOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.BigEndian32}
        isLoading={isLoading}
      />
      <Selector
        name="BigEndian56"
        label={t`56 Bit Format`}
        value={formData?.BigEndian56}
        options={bigEndianOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.BigEndian56}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default MiscellaneousCredentialFormatForm
