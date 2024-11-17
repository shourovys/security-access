import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { ISystemInfoFormData } from '../../../../types/pages/system'
import { softwareIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import SwitchButtonSelect from '../../../atomic/SelectSwitch'

interface IProps {
  formData: ISystemInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function SystemInfoSoftwareForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={softwareIcon} header={t`Software`}>
      <Input
        name="Version"
        label={t`Version`}
        value={formData.Version}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />

      <Input
        name="LatestVersion"
        label={t`Latest Version`}
        value={formData.LatestVersion}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />

      <Input
        name="ReleaseDate"
        label={t`Release Date`}
        value={formData.ReleaseDate}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
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

export default SystemInfoSoftwareForm
