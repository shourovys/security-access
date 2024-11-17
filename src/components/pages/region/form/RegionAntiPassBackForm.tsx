import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { IRegionFormData, regionRoleOptions } from '../../../../types/pages/region'
import { antiPassbackRuleIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IRegionFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function RegionAntiPassBackForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={antiPassbackRuleIcon} header={t`Anti Passback  Rule`}>
      <Selector
        name="AntiPassbackRule"
        label={t`Anti Passback Rule`}
        value={formData?.AntiPassbackRule}
        options={regionRoleOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <div>
        {!(formData?.AntiPassbackRule?.value === '0') && (
          <Input
            name="AntiPassbackTime"
            label={t`Anti Passback Time (min)`}
            type="number"
            value={formData?.AntiPassbackTime}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading}
            error={formErrors?.AntiPassbackTime}
            required={true}
          />
        )}
      </div>
    </FormCardWithHeader>
  )
}

export default RegionAntiPassBackForm
