import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { ISubnodeEditFormData } from '../../../../types/pages/subnode'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: ISubnodeEditFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function SubnodeEditForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={doorIcon} header={t`Subnode`}>
      <Input
        name="SubnodeName"
        label={t`Subnode Name`}
        value={formData?.SubnodeName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.SubnodeName}
        isLoading={isLoading}
      />
      <Input
        name="SubnodeDesc"
        label={t`Description`}
        value={formData?.SubnodeDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.description}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default SubnodeEditForm
