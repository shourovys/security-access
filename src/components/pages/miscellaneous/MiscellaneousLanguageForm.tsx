import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Selector from '../../../components/atomic/Selector'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { IMiscellaneousFormData, LanguageOptions } from '../../../types/pages/miscellaneous'
import { miscellaneousIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: IMiscellaneousFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function MiscellaneousLanguageForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={miscellaneousIcon} header={t`Language`}>
      <Selector
        name="Language"
        label={t`Language`}
        value={formData?.Language}
        options={LanguageOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Language}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default MiscellaneousLanguageForm
