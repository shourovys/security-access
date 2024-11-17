import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import { THandleInputChange } from '../../../../types/components/common'
import { ISystemInfoFormData } from '../../../../types/pages/system'
import { systemIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: ISystemInfoFormData
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function SystemInfoFieldFrom({ formData, handleInputChange, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={systemIcon} header={t`System`}>
      <Input
        name="Name"
        label={t`Name`}
        value={formData.Name}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <Input
        name="BackupMedia"
        label={t`Backup Media`}
        value={formData.BackupMedia}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <Input
        name="RecordMedia"
        label={t`Record Media`}
        value={formData.RecordMedia}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {/* 
      <Input
        name="StartTime"
        label={t`Start Time`}
        value={formData.StartTime ?? ''}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      /> */}
    </FormCardWithHeader>
  )
}

export default SystemInfoFieldFrom
