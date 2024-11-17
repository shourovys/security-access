import { inputApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorFormData, doorRexAndContactTypeOption } from '../../../../types/pages/door'
import { IInputResult } from '../../../../types/pages/input' // Update interface import
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

function DoorRexForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: inputIsLoading, data: inputData } = useSWR<
    IListServerResponse<IInputResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : inputApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.NodeNo}`)
  )

  return (
    <FormCardWithHeader icon={listIcon} header={t`Door Rex`}>
      <SwitchButtonSelect
        name="RexEnable"
        value={formData?.RexEnable}
        onChange={handleInputChange}
        label={t`Door Rex Enable`}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.RexEnable?.value === '1' && (
        <Selector
          name="RexType"
          label={t`Door Rex Type`}
          value={formData?.RexType}
          onChange={handleInputChange}
          options={doorRexAndContactTypeOption}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.RexType}
          isLoading={isLoading}
        />
      )}
      {formData?.RexEnable?.value === '1' && formData?.SubnodeNo && formData?.SubnodeNo !== '0' && (
        <Selector
          name="RexInput"
          label={t`Door Rex Input`}
          value={formData?.RexInput}
          onChange={handleInputChange}
          options={inputData?.data.map((result) => ({
            value: result.InputNo.toString(),
            label: result.InputName,
          }))}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.RexInput}
          isLoading={isLoading || inputIsLoading}
        />
      )}
    </FormCardWithHeader>
  )
}

export default DoorRexForm
