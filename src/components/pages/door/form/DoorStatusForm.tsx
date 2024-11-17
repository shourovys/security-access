import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { IDoorInfoFormData } from '../../../../types/pages/door'
import { statusIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
interface IProps {
  formData?: IDoorInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function DoorStatusForm({ formData, handleInputChange, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={statusIcon} header={t`Status`}>
      <Input
        name="DoorStat"
        label={t`Door Stat`}
        value={formData?.DoorStat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
        // error={formErrors.DoorStat}
      />
      <Input
        name="LockStat"
        label={t`Lock Stat`}
        value={formData?.LockStat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
        // error={formErrors.LockStat}
      />
      <Input
        name="ContactStat"
        label={t`Contact Stat`}
        value={formData?.ContactStat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
        // error={formErrors.ContactStat}
      />
      <Input
        name="AlertStat"
        label={t`Alert Stat`}
        value={formData?.AlertStat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
        // error={formErrors.AlertStat}
      />
    </FormCardWithHeader>
  )
}

export default DoorStatusForm
