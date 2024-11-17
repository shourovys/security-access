import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { IFormatFormData, parityOptions } from '../../../../types/pages/format'
import { listIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: IFormatFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function FormatParity2Form({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  const showOtherParityFields =
    formData.Parity2Type?.value && formData.Parity2Type?.value !== parityOptions[0].value
  return (
    <FormCardWithHeader icon={listIcon} header={t`Parity 2`}>
      <Selector
        name="Parity2Type"
        label={t`Parity 2 Type`}
        options={parityOptions}
        value={formData.Parity2Type}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Parity2Type}
        isLoading={isLoading}
      />
      <div>
        {showOtherParityFields && (
          <Input
            name="Parity2Position"
            label={t`Parity 2 Position `}
            type="number"
            value={formData.Parity2Position}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Parity2Position}
            isLoading={isLoading}
            required={true} //modified by Imran
          />
        )}
      </div>
      <div>
        {showOtherParityFields && (
          <Input
            name="Parity2Start"
            label={t`Parity 2 Start `}
            type="number"
            value={formData.Parity2Start}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Parity2Start}
            isLoading={isLoading}
            required={true} //modified by Imran
          />
        )}
      </div>
      <div>
        {showOtherParityFields && (
          <Input
            name="Parity2Length"
            label={t`Parity 2 Length `}
            type="number"
            value={formData.Parity2Length}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Parity2Length}
            isLoading={isLoading}
            required={true} //modified by Imran
          />
        )}
      </div>
    </FormCardWithHeader>
  )
}

export default FormatParity2Form
