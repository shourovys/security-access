import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { IRegionFormData, regionRoleOptions } from '../../../../types/pages/region'
import { occupancyRuleIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IRegionFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function RegionOccupancyForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={occupancyRuleIcon} header={t`Occupancy Rule`}>
      <Selector
        name="OccupancyRule"
        label={t`Occupancy Rule`}
        value={formData?.OccupancyRule}
        options={regionRoleOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {!(formData?.OccupancyRule?.value === '0') && (
        <div>
          <Input
            name="OccupancyLimit"
            label={t`Occupancy Limit`}
            type="number"
            value={formData?.OccupancyLimit}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading}
            error={formErrors?.OccupancyLimit}
            required={true}
          />
        </div>
      )}
    </FormCardWithHeader>
  )
}

export default RegionOccupancyForm
