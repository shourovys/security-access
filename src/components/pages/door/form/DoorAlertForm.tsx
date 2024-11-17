import { outputApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorFormData } from '../../../../types/pages/door'
import { IOutputResult } from '../../../../types/pages/output'
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

function DoorAlertForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: outputIsLoading, data: outputData } = useSWR<
    IListServerResponse<IOutputResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : outputApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.NodeNo}`)
  )
  return (
    <FormCardWithHeader icon={listIcon} header={t`Alert`}>
      <SwitchButtonSelect
        name="ForcedEnable"
        label={t`Forced Alert Enable`}
        value={formData?.ForcedEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <SwitchButtonSelect
        name="ProppedEnable"
        label={t`Propped Alert Enable`}
        value={formData?.ProppedEnable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {(formData?.ForcedEnable?.value === '1' || formData?.ProppedEnable?.value === '1') && (
        <Selector
          name="AlertOutput"
          label={t`Alert Output `}
          value={formData?.AlertOutput}
          options={outputData?.data.map((result) => ({
            value: result.OutputNo.toString(),
            label: result.OutputName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.AlertOutput}
          isLoading={isLoading || outputIsLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default DoorAlertForm
