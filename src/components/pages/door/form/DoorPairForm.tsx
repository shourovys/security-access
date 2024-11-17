import { doorApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorFormData, IDoorResult } from '../../../../types/pages/door'
import { SERVER_QUERY } from '../../../../utils/config'
import { listIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IDoorFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
  doorNo: string
}

function DoorPairForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  doorNo,
}: IProps) {
  const { isLoading: doorIsLoading, data: doorData } = useSWR<IListServerResponse<IDoorResult[]>>(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : doorApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.NodeNo}`)
  )

  // filter current door from door list
  const filteredDoorData = doorData?.data.filter((door) => door.DoorNo.toString() !== doorNo)

  return (
    <FormCardWithHeader icon={listIcon} header={t`Pair Door`}>
      <SwitchButtonSelect
        name="PairDoorEnable"
        label={t`Pair Door Enable`}
        value={formData?.PairDoorEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.PairDoorEnable?.value === '1' && (
        <Selector
          name="PairDoor"
          label={t`Pair Door `}
          value={formData?.PairDoor}
          options={(filteredDoorData || []).map((result) => ({
            value: result.DoorNo.toString(),
            label: result.DoorName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.PairDoor}
          isLoading={isLoading || doorIsLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default DoorPairForm
