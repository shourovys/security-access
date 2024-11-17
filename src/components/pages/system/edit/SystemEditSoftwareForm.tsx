import FormCardWithHeader from '../../../HOC/FormCardWithHeader'
import Input from '../../../atomic/Input'
import Selector from '../../../atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { INodeScanSystemFormData } from '../../../../types/pages/nodeScan'
import {
  ISystemEditFormData,
  ISystemInfoFormData,
  systemBoardCountOptions,
} from '../../../../types/pages/system'
import { boardIcon, softwareIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import SwitchButtonSelect from '../../../atomic/SelectSwitch'

interface IProps {
  formData: ISystemEditFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function SystemEditSoftwareForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={softwareIcon} header={t`Software`}>
      <SwitchButtonSelect
        name="AutoUpdate"
        label={t`Auto Update`}
        value={formData.AutoUpdate}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default SystemEditSoftwareForm
