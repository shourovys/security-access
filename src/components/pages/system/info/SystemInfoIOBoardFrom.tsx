import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { ISystemInfoFormData, systemBoardCountOptions } from '../../../../types/pages/system'
import { boardIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: ISystemInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function SystemInfoIOBoardFrom({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={boardIcon} header={t`I/O Board`}>
      <Input
        name="Product"
        label={t`Product`}
        value={formData.Product}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <Selector
        name="BoardCount"
        label={t`Board Count`}
        value={formData.BoardCount}
        options={systemBoardCountOptions}
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.BoardCount}
        isLoading={isLoading}
      />
      <Input
        name="Board1"
        label={t`Board1`}
        value={formData.Board1}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />

      {formData.BoardCount?.value == '2' && (
        <Input
          name="Board2"
          label={t`Board 2`}
          value={formData.Board2}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
        />
      )}
    </FormCardWithHeader>
  )
}

export default SystemInfoIOBoardFrom
