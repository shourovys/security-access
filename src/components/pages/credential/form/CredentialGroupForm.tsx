import { formatApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange, THandleInputSelect } from '../../../../types/components/common'
import {
  IFormErrors,
  IListServerResponse,
  ISelectedInputFields,
} from '../../../../types/pages/common'
import {
  ICredentialBulkLoadFormData,
  ICredentialFormData,
  ICredentialGroupEditFormData,
  credentialStatsOptions,
  credentialTypesOptions,
} from '../../../../types/pages/credential'
import { IFormatResult } from '../../../../types/pages/format'
import { SERVER_QUERY } from '../../../../utils/config'
import { credentialIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import DateTimeInput from '../../../atomic/DateTimeInput'

interface IProps {
  formData: ICredentialFormData | ICredentialGroupEditFormData | ICredentialBulkLoadFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
  queryFormatIsLoading?: boolean
  // props for checkbox in header
  selectedInputFields?: ISelectedInputFields<ICredentialGroupEditFormData>
  handleSelect?: THandleInputSelect
}

function CredentialGroupForm({
  formData,
  formErrors,
  handleInputChange,
  disabled,
  isLoading,
  queryFormatIsLoading,
  selectedInputFields,
  handleSelect,
}: IProps) {
  const { isLoading: formatIsLoading, data: formatData } = useSWR<
    IListServerResponse<IFormatResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : formatApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={credentialIcon} header={t`Credential`}>
      <Selector
        name="CredentialType"
        label={t`Credential Type`}
        value={formData.CredentialType}
        options={credentialTypesOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.CredentialType}
        isLoading={isLoading}
        isSelected={selectedInputFields?.CredentialType}
        handleSelect={handleSelect}
      />
      <Selector
        name="CredentialStat"
        label={t`Credential Stat`}
        value={formData.CredentialStat}
        options={credentialStatsOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.CredentialStat}
        isLoading={isLoading}
        isSelected={selectedInputFields?.CredentialStat}
        handleSelect={handleSelect}
      />
      <SwitchButtonSelect
        name="NeverExpired"
        label={t`Never Expire`}
        value={formData.NeverExpired}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
        isSelected={selectedInputFields?.NeverExpired}
        handleSelect={handleSelect}
      />
      {formData.NeverExpired?.value === '0' && (
        <DateTimeInput
          name="StartTime"
          label={t`Start Time `}
          value={formData.StartTime}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.StartTime}
          isLoading={isLoading}
          isSelected={selectedInputFields?.NeverExpired}
          handleSelect={handleSelect}
          format="yyyy-MM-dd HH:mm"
          required={true}
        />
      )}

      {formData.NeverExpired?.value === '0' && (
        <DateTimeInput
          name="EndTime"
          label={t`End Time `}
          value={formData.EndTime}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.EndTime}
          isLoading={isLoading}
          isSelected={selectedInputFields?.NeverExpired}
          handleSelect={handleSelect}
          format="yyyy-MM-dd HH:mm"
          required={true}
        />
      )}
    </FormCardWithHeader>
  )
}

export default CredentialGroupForm
