import { outputApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IOutputResult } from '../../../../types/pages/output'
import { IRegionFormData } from '../../../../types/pages/region'
import { SERVER_QUERY } from '../../../../utils/config'
import { deadmanRuleIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IRegionFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function RegionDeadmanRuleForm({
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
      : outputApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={deadmanRuleIcon} header={t`Deadman Rule`}>
      <SwitchButtonSelect
        name="DeadmanRule"
        label={t`Deadman Rule`}
        value={formData?.DeadmanRule}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.DeadmanRule?.value === '1' && (
        <Input
          name="DeadmanInterval"
          label={t`Deadman Interval (min) `}
          type="number"
          value={formData.DeadmanInterval}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
          error={formErrors?.DeadmanInterval}
          required={true} // modified by Imran
        />
      )}
      {formData?.DeadmanRule?.value === '1' && (
        <Selector
          name="DeadmanOutputNo"
          label={t`Deadman Output No `}
          value={formData.DeadmanOutputNo}
          options={outputData?.data.map((data) => ({
            label: data.OutputName,
            value: data.OutputNo.toString(),
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading || outputIsLoading}
          error={formErrors?.DeadmanOutputNo}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default RegionDeadmanRuleForm
