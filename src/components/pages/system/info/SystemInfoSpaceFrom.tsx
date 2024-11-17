import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import { THandleInputChange } from '../../../../types/components/common'
import { ISystemInfoFormData } from '../../../../types/pages/system'
import { shuttleSpace } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: ISystemInfoFormData
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function SystemInfoSpaceFrom({ formData, handleInputChange, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={shuttleSpace} header={t`System Space`}>
      <Input
        name="SystemTotal"
        label={t`System Total`}
        value={formData.SystemTotal}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <Input
        name="SystemFree"
        label={t`System Free`}
        value={formData.SystemFree}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default SystemInfoSpaceFrom
