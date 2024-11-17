import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { INodeScanSystemFormData } from '../../../../types/pages/nodeScan'
import { ISystemEditFormData, systemMediaOptions } from '../../../../types/pages/system'
import { systemIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: ISystemEditFormData | INodeScanSystemFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function SystemEditFieldFrom({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={systemIcon} header={t`System`}>
      <Input
        name="Name"
        label={t`Name `}
        value={formData.Name}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Name}
        isLoading={isLoading}
        required={true}
      />
      <Selector
        name="BackupMedia"
        label={t`Backup Media`}
        value={formData.BackupMedia}
        options={systemMediaOptions}
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.BackupMedia}
        isLoading={isLoading}
      />
      <Selector
        name="RecordMedia"
        label={t`Record Media`}
        value={formData.RecordMedia}
        options={systemMediaOptions}
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.RecordMedia}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default SystemEditFieldFrom
