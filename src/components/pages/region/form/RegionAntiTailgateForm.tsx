import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IRegionFormData, regionRoleOptions } from '../../../../types/pages/region'
import { antiPassbackRuleIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IRegionFormData
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function RegionAntiTailgateForm({ formData, handleInputChange, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={antiPassbackRuleIcon} header={t`Anti Tailgate Rule`}>
      <Selector
        name="AntiTailgateRule"
        label={t`Anti Tailgate Rule`}
        value={formData?.AntiTailgateRule}
        options={regionRoleOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default RegionAntiTailgateForm
