import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { IRegionFormData } from '../../../../types/pages/region'
import { antiTailgateRuleIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import TimeInput from '../../../atomic/TimeInput'

interface IProps {
  formData?: IRegionFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function RegionResetDailyForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={antiTailgateRuleIcon} header={t`Reset Daily`}>
      <SwitchButtonSelect
        name="ResetDaily"
        label={t`Reset Daily`}
        value={formData?.ResetDaily}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {/* <Input
        name="ResetDaily"
        label={t`Reset Daily`}
        type="number"
        value={formData?.ResetDaily}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
        error={formErrors?.ResetDaily}
      /> */}
      {formData?.ResetDaily?.value !== '0' && (
        <TimeInput
          name="ResetTime"
          label={t`Reset Time `}
          value={formData?.ResetTime}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
          error={formErrors?.ResetTime}
          format="HH:mm"
          required={true}
        />
      )}
    </FormCardWithHeader>
  )
}

export default RegionResetDailyForm
