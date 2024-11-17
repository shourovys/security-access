import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { INewFormErrors } from '../../../../types/pages/common'
import { IPersonFormData, personThreatOptions } from '../../../../types/pages/person'
import { listIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: IPersonFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IPersonFormData>
  disabled?: boolean
  isLoading?: boolean
}

function PersonOptionForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={listIcon} header={t`Option`}>
      <div className="flex items-center justify-between">
        <SwitchButtonSelect
          name="Ada"
          value={formData.Ada}
          onChange={handleInputChange}
          label={t`ADA`}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
        />
        <SwitchButtonSelect
          name="Invite"
          value={formData.Invite}
          onChange={handleInputChange}
          label={t`Invite`}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
        />
        <SwitchButtonSelect
          name="Exempt"
          value={formData.Exempt}
          onChange={handleInputChange}
          label={t`Exempt`}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
        />
      </div>

      <Selector
        name="ThreatLevel"
        label={t`Threat Level`}
        options={personThreatOptions}
        value={formData.ThreatLevel}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ThreatLevel}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default PersonOptionForm
