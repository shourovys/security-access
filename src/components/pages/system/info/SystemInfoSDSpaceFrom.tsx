import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { booleanSelectOption } from '../../../../types/pages/common'
import { ISystemInfoFormData } from '../../../../types/pages/system'
import { sdCardIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: ISystemInfoFormData
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function SystemInfoSDSpaceFrom({ formData, handleInputChange, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={sdCardIcon} header={t`SD Space`}>
      {/* <Selector
        name="SdMount"
        label={t`SD Mount`}
        value={formData.SdMount}
        options={booleanSelectOption}
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      /> */}
      <Input
        name="SdTotal"
        label={t`SD Total`}
        value={formData.SdTotal}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <Input
        name="SdFree"
        label={t`SD Free`}
        value={formData.SdFree}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default SystemInfoSDSpaceFrom
