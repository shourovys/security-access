import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { booleanSelectOption } from '../../../../types/pages/common'
import { ISystemInfoFormData } from '../../../../types/pages/system'
import { usbIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: ISystemInfoFormData
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function SystemInfoUSBSpaceFrom({ formData, handleInputChange, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={usbIcon} header={t`USB Space`}>
      {/* <Selector
        name="UsbMount"
        label={t`USB Mount`}
        value={formData.UsbMount}
        options={booleanSelectOption}
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      /> */}
      <Input
        name="UsbTotal"
        label={t`USB Total`}
        value={formData.UsbTotal}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <Input
        name="UsbFree"
        label={t`USB Free`}
        value={formData.UsbFree}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default SystemInfoUSBSpaceFrom
