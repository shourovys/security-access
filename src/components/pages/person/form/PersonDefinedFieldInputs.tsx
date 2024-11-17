import { THandleInputChange, THandleInputSelect } from '../../../../types/components/common'
import { IFormErrors, ISelectedInputFields } from '../../../../types/pages/common'
import { IDefinedFieldResult } from '../../../../types/pages/definedField'
import { IPersonFormData, IPersonGroupEditFormData } from '../../../../types/pages/person'
import t from '../../../../utils/translator'
import Input from '../../../atomic/Input'

interface IProps {
  definedField: IDefinedFieldResult
  formData?: IPersonFormData | IPersonGroupEditFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
  // props for checkbox in header
  selectedInputFields?: ISelectedInputFields<IPersonGroupEditFormData>
  handleSelect?: THandleInputSelect
}

function PersonDefinedFieldInputs({
  definedField,
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  selectedInputFields,
  handleSelect,
}: IProps) {
  const { FieldNo, FilterEnable, FieldName } = definedField
  const FieldNameWithT = t`${FieldName}`
  if (FilterEnable) {
    switch (FieldNo) {
      case 1:
        return (
          <Input
            name="Field1"
            // placeholder="Phone"
            label={FieldNameWithT}
            value={formData?.Field1}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field1}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field1}
            handleSelect={handleSelect}
          />
        )
      case 2:
        return (
          <Input
            name="Field2"
            label={FieldNameWithT}
            value={formData?.Field2}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field2}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field2}
            handleSelect={handleSelect}
          />
        )
      case 3:
        return (
          <Input
            name="Field3"
            label={FieldNameWithT}
            value={formData?.Field3}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field3}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field3}
            handleSelect={handleSelect}
          />
        )
      case 4:
        return (
          <Input
            name="Field4"
            label={FieldNameWithT}
            value={formData?.Field4}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field4}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field4}
            handleSelect={handleSelect}
          />
        )
      case 5:
        return (
          <Input
            name="Field5"
            label={FieldNameWithT}
            value={formData?.Field5}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field5}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field5}
            handleSelect={handleSelect}
          />
        )
      case 6:
        return (
          <Input
            name="Field6"
            label={FieldNameWithT}
            value={formData?.Field6}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field6}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field6}
            handleSelect={handleSelect}
          />
        )
      case 7:
        return (
          <Input
            name="Field7"
            label={FieldNameWithT}
            value={formData?.Field7}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field7}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field7}
            handleSelect={handleSelect}
          />
        )
      case 8:
        return (
          <Input
            name="Field8"
            label={FieldNameWithT}
            value={formData?.Field8}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field8}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field8}
            handleSelect={handleSelect}
          />
        )
      case 9:
        return (
          <Input
            name="Field9"
            label={FieldNameWithT}
            value={formData?.Field9}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field9}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field9}
            handleSelect={handleSelect}
          />
        )
      case 10:
        return (
          <Input
            name="Field10"
            label={FieldNameWithT}
            value={formData?.Field10}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field10}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field10}
            handleSelect={handleSelect}
          />
        )
      case 11:
        return (
          <Input
            name="Field11"
            label={FieldNameWithT}
            value={formData?.Field11}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field11}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field11}
            handleSelect={handleSelect}
          />
        )
      case 12:
        return (
          <Input
            name="Field12"
            label={FieldNameWithT}
            value={formData?.Field12}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field12}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field12}
            handleSelect={handleSelect}
          />
        )
      case 13:
        return (
          <Input
            name="Field13"
            label={FieldNameWithT}
            value={formData?.Field13}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field13}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field13}
            handleSelect={handleSelect}
          />
        )
      case 14:
        return (
          <Input
            name="Field14"
            label={FieldNameWithT}
            value={formData?.Field14}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field14}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field14}
            handleSelect={handleSelect}
          />
        )
      case 15:
        return (
          <Input
            name="Field15"
            label={FieldNameWithT}
            value={formData?.Field15}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field15}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field15}
            handleSelect={handleSelect}
          />
        )
      case 16:
        return (
          <Input
            name="Field16"
            label={FieldNameWithT}
            value={formData?.Field16}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field16}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field16}
            handleSelect={handleSelect}
          />
        )
      case 17:
        return (
          <Input
            name="Field17"
            label={FieldNameWithT}
            value={formData?.Field17}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field17}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field17}
            handleSelect={handleSelect}
          />
        )
      case 18:
        return (
          <Input
            name="Field18"
            label={FieldNameWithT}
            value={formData?.Field18}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field18}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field18}
            handleSelect={handleSelect}
          />
        )
      case 19:
        return (
          <Input
            name="Field19"
            label={FieldNameWithT}
            value={formData?.Field19}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field19}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field19}
            handleSelect={handleSelect}
          />
        )
      case 20:
        return (
          <Input
            name="Field20"
            label={FieldNameWithT}
            value={formData?.Field20}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Field20}
            isLoading={isLoading}
            isSelected={selectedInputFields?.Field20}
            handleSelect={handleSelect}
          />
        )

      default:
        return null
    }
  }

  return null
}

export default PersonDefinedFieldInputs
