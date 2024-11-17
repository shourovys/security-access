import { inputApi, outputApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorFormData } from '../../../../types/pages/door'
import { IInputResult } from '../../../../types/pages/input' // Update interface import
import { IOutputResult } from '../../../../types/pages/output' // Update interface import
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

function DoorBuglarAlarmForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  const { isLoading: outputIsLoading, data: outputData } = useSWR<
    IListServerResponse<IOutputResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : outputApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.NodeNo}`)
  )

  const { isLoading: inputIsLoading, data: inputData } = useSWR<
    IListServerResponse<IInputResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : inputApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.NodeNo}`)
  )

  return (
    <FormCardWithHeader icon={listIcon} header={t`Buglar Alarm`}>
      <SwitchButtonSelect
        name="BurgAlarmEnable"
        value={formData?.BurgAlarmEnable}
        onChange={handleInputChange}
        label={t`Burg Alarm Enable`}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.BurgAlarmEnable?.value === '1' && (
        <Selector
          name="BurgOutput"
          label={t`Burglar Alarm Output `}
          value={formData?.BurgOutput}
          options={outputData?.data.map((result) => ({
            value: result.OutputNo.toString(),
            label: result.OutputName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.BurgOutput}
          isLoading={isLoading || outputIsLoading}
          required={true} // modified by Imran
        />
      )}

      {formData?.BurgAlarmEnable?.value === '1' && (
        <Selector
          name="BurgInput"
          label={t`Burglar Alarm Input `}
          value={formData?.BurgInput}
          options={inputData?.data.map((result) => ({
            value: result.InputNo.toString(),
            label: result.InputName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.BurgInput}
          isLoading={isLoading || outputIsLoading}
          required={true} // modified by Imran
        />
      )}

      {formData?.BurgAlarmEnable?.value === '1' && (
        <SwitchButtonSelect
          name="BurgZoneEnable"
          value={formData?.BurgZoneEnable}
          onChange={handleInputChange}
          label={t`Burg Zone Enable`}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
        />
      )}

      {formData?.BurgAlarmEnable?.value === '1' && formData?.BurgZoneEnable?.value === '1' && (
        <Selector
          name="BurgZoneInput"
          label={t`Burglar Zone Input `}
          value={formData?.BurgZoneInput}
          options={inputData?.data.map((result) => ({
            value: result.InputNo.toString(),
            label: result.InputName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.BurgZoneInput}
          isLoading={isLoading || inputIsLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default DoorBuglarAlarmForm
