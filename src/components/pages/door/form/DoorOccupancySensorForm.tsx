import { inputApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorFormData } from '../../../../types/pages/door'
import { IInputResult } from '../../../../types/pages/input'
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

function DoorOccupancySensorForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  const { isLoading: inputIsLoading, data: inputData } = useSWR<
    IListServerResponse<IInputResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : inputApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.NodeNo}`)
  )

  return (
    <FormCardWithHeader icon={listIcon} header={t`Occupancy Sensor`}>
      <SwitchButtonSelect
        name="OccupancyEnable"
        label={t`Occupancy Enable`}
        value={formData?.OccupancyEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.OccupancyEnable?.value === '1' && (
        <Selector
          name="OccupancyInput"
          label={t`Occupancy Input `}
          value={formData?.OccupancyInput}
          options={inputData?.data.map((result) => ({
            value: result.InputNo.toString(),
            label: result.InputName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.OccupancyInput}
          isLoading={isLoading || inputIsLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default DoorOccupancySensorForm
