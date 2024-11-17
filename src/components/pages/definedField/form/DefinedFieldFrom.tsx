import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { IDefinedFieldFormData } from '../../../../types/pages/definedField'
import { definedFieldIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IDefinedFieldFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
  isFieldNoEditAble?: boolean
}

function DefinedFieldForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  isFieldNoEditAble,
}: IProps) {
  return (
    <FormCardWithHeader icon={definedFieldIcon} header={t`Defined Field`}>
      <Input
        name="FieldNo"
        label={t`Field No `}
        type="number"
        value={formData?.FieldNo}
        onChange={handleInputChange}
        disabled={!isFieldNoEditAble}
        error={formErrors?.FieldNo}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="FieldName"
        label={t`Field Name `}
        value={formData?.FieldName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.FieldName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <SwitchButtonSelect
        name="FilterEnable"
        label={t`Field Enable`}
        value={formData?.FilterEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {/* Exchange filter enable and FieldEnable --rubel */}
      {/* <SwitchButtonSelect
        name="FieldEnable"
        label={t`Filter Enable `}
        value={formData?.FieldEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      /> */}
      <SwitchButtonSelect
        name="ListEnable"
        label={t`List Enable`}
        value={formData?.ListEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <SwitchButtonSelect
        name="FieldEnable"
        label={t`Filter Enable `}
        value={formData?.FieldEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default DefinedFieldForm
