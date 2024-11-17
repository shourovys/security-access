import { inputApi, outputApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IInputResult } from '../../../../types/pages/input'
import { IOutputResult } from '../../../../types/pages/output'
import { IRegionFormData } from '../../../../types/pages/region'
import { SERVER_QUERY } from '../../../../utils/config'
import { hazmatRuleIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IRegionFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function RegionHazmatRuleForm({
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
      : inputApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: outputIsLoading, data: outputData } = useSWR<
    IListServerResponse<IOutputResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : outputApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={hazmatRuleIcon} header={t`Hazmat Rule`}>
      <SwitchButtonSelect
        name="HazmatRule"
        label={t`Hazmat Rule`}
        value={formData?.HazmatRule}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.HazmatRule?.value === '1' && (
        <>
          <Selector
            name="HazmatInputNo"
            label={t`Hazmat Input No `}
            value={formData?.HazmatInputNo}
            options={inputData?.data.map((data) => ({
              label: data.InputName,
              value: data.InputNo.toString(),
            }))}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading || inputIsLoading}
            error={formErrors?.HazmatInputNo}
            required={true} // modified by Imran
          />
          <Selector
            name="HazmatOutputNo"
            label={t`Hazmat Output No `}
            value={formData?.HazmatOutputNo}
            options={outputData?.data.map((data) => ({
              label: data.OutputName,
              value: data.OutputNo.toString(),
            }))}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading || outputIsLoading}
            error={formErrors?.HazmatOutputNo}
            required={true} // modified by Imran
          />
        </>
      )}
    </FormCardWithHeader>
  )
}

export default RegionHazmatRuleForm
