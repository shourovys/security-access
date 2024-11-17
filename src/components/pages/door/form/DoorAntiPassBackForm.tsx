import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { IDoorFormData, doorAntiPassTypeOption } from '../../../../types/pages/door'
import { listIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IDoorFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function DoorAntiPassBackForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={listIcon} header={t`Anti Passback`}>
      <SwitchButtonSelect
        name="AntiPassbackRule"
        label={t`Anti Passback Rule`}
        value={formData?.AntiPassbackRule}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {/* {formData?.AntiPassbackRule?.value === '1' && (
        <Selector
          name="AntiPassbackType"
          label={t`Anti Passback Type`}
          value={formData?.AntiPassbackType}
          options={doorAntiPassTypeOption}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.AntiPassbackType}
          isLoading={isLoading}
        />
      )} */}
      {formData?.AntiPassbackRule?.value === '1' && (
        <Input
          name="AntiPassbackTime"
          label={t`Anti Passback Time (sec) `}
          type="number"
          value={formData?.AntiPassbackTime}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.AntiPassbackTime}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default DoorAntiPassBackForm
