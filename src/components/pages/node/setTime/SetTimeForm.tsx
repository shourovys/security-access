import { timeApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, ISingleServerResponse } from '../../../../types/pages/common'
import { INodeSetTimeFormData } from '../../../../types/pages/node'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: INodeSetTimeFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function SetTimeForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: allTimezoneLoading, data: allTimezoneData } = useSWR<
    ISingleServerResponse<string[]>
  >(disabled || typeof handleInputChange === 'undefined' ? null : timeApi.timezone)

  return (
    <FormCardWithHeader icon={doorIcon} header={t`Time`}>
      <Selector
        name="Timezone"
        label={t`Timezone`}
        value={formData?.Timezone}
        options={allTimezoneData?.data.map((option) => ({
          label: option,
          value: option,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Timezone}
        isLoading={isLoading || allTimezoneLoading}
        isSearchable={true}
      />
      <SwitchButtonSelect
        name="Ntp"
        label={t`NTP`}
        value={formData?.Ntp}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default SetTimeForm
