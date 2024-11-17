import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Selector from '../../../components/atomic/Selector'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import {
  IMiscellaneousFormData,
  dateFormatOptions,
  timeFormatOptions,
} from '../../../types/pages/miscellaneous'
import { miscellaneousIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: IMiscellaneousFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function MiscellaneousTimeFormatForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={miscellaneousIcon} header={t`Time Format`}>
      <Selector
        name="DateFormat"
        label={t`Date Format`}
        value={formData?.DateFormat}
        options={dateFormatOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.DateFormat}
        isLoading={isLoading}
      />
      <Selector
        name="TimeFormat"
        label={t`Time Format`}
        value={formData?.TimeFormat}
        options={timeFormatOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.TimeFormat}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default MiscellaneousTimeFormatForm
