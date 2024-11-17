import useSWR from 'swr'
import { threatApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import MultipleCheckbox from '../../../../components/atomic/MultipleCheckbox'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorFormData, doorThreatLevelOption } from '../../../../types/pages/door'
import { IThreatResult } from '../../../../types/pages/threat'
import { SERVER_QUERY } from '../../../../utils/config'
import { listIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IDoorFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function DoorThreatLevelForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  const { isLoading: threatIsLoading, data: threatData } = useSWR<
    IListServerResponse<IThreatResult[]>
  >(threatApi.list(SERVER_QUERY.selectorDataQuery))

  return (
    <FormCardWithHeader icon={listIcon} header={t`Threat Level`}>
      <Selector
        name="Threat"
        label="Threat"
        value={formData?.Threat}
        options={threatData?.data.map((result) => ({
          value: result.ThreatNo.toString(),
          label: result.ThreatName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Threat}
        isLoading={isLoading || threatIsLoading}
      />

      <Selector
        name="ThreatLevel"
        label={t`Threat Level`}
        value={formData?.ThreatLevel}
        options={doorThreatLevelOption}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ThreatLevel}
        isLoading={isLoading}
      />
      <SwitchButtonSelect
        name="ThreatIgnoreRex"
        label={t`Threat Ignore Rex`}
        value={formData?.ThreatIgnoreRex}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default DoorThreatLevelForm
