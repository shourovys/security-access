import { definedFieldApi } from '../../../api/urls'
import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import SwitchButtonSelect from '../../../components/atomic/SelectSwitch'
import Selector from '../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../types/components/common'
import { IListServerResponse, INewFormErrors } from '../../../types/pages/common'
import { IDefinedFieldResult } from '../../../types/pages/definedField'
import { ISipFormData } from '../../../types/pages/sip'
import { SERVER_QUERY } from '../../../utils/config'
import { sipIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: ISipFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<ISipFormData>
  disabled?: boolean
  isLoading?: boolean
}

function SipForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: definedFieldIsLoading, data: definedFieldData } = useSWR<
    IListServerResponse<IDefinedFieldResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : definedFieldApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={sipIcon} header={t`SIP Configuration`}>
      <SwitchButtonSelect
        name="Enable"
        label={t`Enable`}
        value={formData?.Enable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.Enable?.value === '1' && (
        <Input
          name="ServerAddr"
          // placeholder='https://www.example.com'
          label={t`Server Address `}
          value={formData?.ServerAddr}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ServerAddr}
          isLoading={isLoading}
          required={true}
        />
      )}
      {formData?.Enable?.value === '1' && (
        <Input
          name="ServerPort"
          label={t`Server Port `}
          type="number"
          value={formData?.ServerPort}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ServerPort}
          isLoading={isLoading}
          required={true}
        />
      )}
      {formData?.Enable?.value === '1' && (
        <Selector
          name="SipFieldNo"
          label={t`SIP Field`}
          value={formData?.SipFieldNo}
          options={definedFieldData?.data.map((result) => ({
            value: result.FieldNo.toString(),
            label: result.FieldName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.SipFieldNo}
          isLoading={isLoading || definedFieldIsLoading}
          required={true}
        />
      )}
    </FormCardWithHeader>
  )
}

export default SipForm
