import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { IFormatFormData } from '../../../../types/pages/format'
import { binaryToDecimal, getValidSubBinary } from '../../../../utils/binaryToDecimal'
import { scanIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: IFormatFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function FormatScanDataForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  // Update the TotalLength and FacilityCode data when CardData input changes
  const handleCardDataChange: THandleInputChange = (name, value) => {
    if (handleInputChange) {
      handleInputChange('CardData', value)
      handleInputChange('TotalLength', value?.toString().length)

      const facilityStart = Number(formData.FacilityStart)
      const facilityLength = Number(formData.FacilityLength)
      const cardData = value

      if (facilityStart >= 0 && facilityLength > 0 && typeof cardData === 'string') {
        const validSubBinary = getValidSubBinary(cardData, facilityStart, facilityLength)
        if (validSubBinary) {
          const facilityCode = binaryToDecimal(validSubBinary)
          handleInputChange('FacilityCode', facilityCode)
        }
      }

      const numberStart = Number(formData.NumberStart)
      const numberLength = Number(formData.NumberLength)

      if (numberStart >= 0 && numberLength > 0 && typeof cardData === 'string') {
        const validSubBinary = getValidSubBinary(cardData, numberStart, numberLength)
        if (validSubBinary) {
          const numberCode = binaryToDecimal(validSubBinary)
          handleInputChange('CardNumber', numberCode)
        }
      }
    }
  }

  return (
    <FormCardWithHeader icon={scanIcon} header={t`Scan Data`}>
      <Input
        name="CardData"
        // placeholder="Card Data"
        label={t`Card Data`}
        type="number"
        value={formData.CardData}
        onChange={handleCardDataChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.CardData}
        isLoading={isLoading}
      />
      <Input
        name="CardNumber"
        label={t`Card Number`}
        type="number"
        value={formData.CardNumber}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined' || true}
        error={formErrors?.CardNumber}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default FormatScanDataForm
