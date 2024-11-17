import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import { THandleInputChange } from '../../../../types/components/common'
import { IRegionFormData } from '../../../../types/pages/region'
import { regionStatusIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IRegionFormData
  handleInputChange?: THandleInputChange
  // formErrors?: IFormErrors;
  disabled?: boolean
  isLoading?: boolean
}

function RegionStatusForm({ formData, handleInputChange, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={regionStatusIcon} header={t`Status`}>
      {/* <SwitchButtonSelect
        name="DeadmanStat"
        label={t`Deadman Stat`}
        value={formData?.DeadmanStat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <SwitchButtonSelect
        name="HazmatStat"
        label={t`Hazmat Stat`}
        value={formData?.HazmatStat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      /> */}
    </FormCardWithHeader>
  )
}
export default RegionStatusForm
