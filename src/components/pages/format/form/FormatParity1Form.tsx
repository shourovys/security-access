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
function FormatParity1Form({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  const showOtherParityFields =
    formData.Parity1Type?.value && formData.Parity1Type?.value !== parityOptions[0].value
  return (
    <FormCardWithHeader icon={listIcon} header={t`Parity 1`}>
      <Selector
        name="Parity1Type"
        label={t`Parity 1 Type`}
        value={formData.Parity1Type}
        options={parityOptions}
        onChange={handleInputChange}
        error={formErrors?.Parity1Type}
        isLoading={isLoading}
        disabled={disabled || typeof handleInputChange === 'undefined'}
      />
      <div>
        {showOtherParityFields && (
          <Input
            name="Parity1Position"
            label={t`Parity 1 Position `}
            type="number"
            value={formData.Parity1Position}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Parity1Position}
            isLoading={isLoading}
            required={true} //modified by Imran
          />
        )}
      </div>
      <div>
        {showOtherParityFields && (
          <Input
            name="Parity1Start"
            label={t`Parity 1 Start `}
            type="number"
            value={formData.Parity1Start}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Parity1Start}
            isLoading={isLoading}
            required={true} //modified by Imran
          />
        )}
      </div>
      <div>
        {showOtherParityFields && (
          <Input
            name="Parity1Length"
            label={t`Parity 1 Length `}
            type="number"
            value={formData.Parity1Length}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Parity1Length}
            isLoading={isLoading}
            required={true} //modified by Imran
          />
        )}
      </div>
    </FormCardWithHeader>
  )
}

export default FormatParity1Form
