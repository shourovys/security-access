import { groupApi } from '../../../../api/urls'
import { ElementsApi } from '../../../../api/urls/common'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import FormCardInputTwoPart from '../../../../components/HOC/style/form/FormCardInputTwoPart'
import Selector, { TSelectValue } from '../../../../components/atomic/Selector'
import Textarea from '../../../../components/atomic/Textarea'
import MultiSelect from '../../../../components/common/form/MultiSelect'
import useSWR from 'swr'
import { THandleInputChange, THandleInputSelect } from '../../../../types/components/common'
import {
  IFormErrors,
  IListServerResponse,
  INewElementsResult,
  accessSelectOption,
} from '../../../../types/pages/common'
import {
  ICredentialBulkLoadFormData,
  ICredentialFormData,
  ICredentialGroupEditFormData,
} from '../../../../types/pages/credential'
import { IGroupResult } from '../../../../types/pages/group'
import { SERVER_QUERY } from '../../../../utils/config'
import { credentialAccessIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: ICredentialFormData | ICredentialGroupEditFormData | ICredentialBulkLoadFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
  // props for checkbox in header
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function CredentialAccessForm({
  formData,
  formErrors,
  handleInputChange,
  disabled,
  isLoading,
  isSelected,
  handleSelect,
}: IProps) {
  // Fetch elements by type from the server
  const { isLoading: AccessIdsIsLoading, data: AccessIdsData } = useSWR<
    IListServerResponse<INewElementsResult[]>
  >(
    // disabled ||
    //     typeof handleInputChange === "undefined" ||
    formData.CredentialAccessSelect?.label !== 'Individual' ? null : ElementsApi.list(`type=Access`)
  )

  const { isLoading: groupIsLoading, data: groupData } = useSWR<
    IListServerResponse<IGroupResult[]>
  >(
    // disabled ||
    //     typeof handleInputChange === "undefined" ||
    formData.CredentialAccessSelect?.label !== 'Group'
      ? null
      : groupApi.list(`${SERVER_QUERY.selectorDataQuery}&type=access`)
  )

  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('CredentialGroupIds', [])
      handleInputChange('CredentialAccessIds', [])
    }
  }

  return (
    <FormCardWithHeader
      icon={credentialAccessIcon}
      header={t`Credential Access`}
      twoPart={false}
      selectName="CredentialAccessSelect"
      isSelected={isSelected}
      handleSelect={handleSelect}
    >
      <FormCardInputTwoPart>
        <Selector
          name="CredentialAccessSelect"
          label={t`Select Type`}
          value={formData.CredentialAccessSelect}
          options={accessSelectOption}
          onChange={handleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.CredentialAccessSelect}
          isLoading={isLoading}
        />

        {(disabled || typeof handleInputChange === 'undefined') &&
          'CredentialGroups' in formData &&
          'CredentialAccesses' in formData && (
            <Textarea
              name="CredentialGroupIdsAndCredentialAccessIds"
              label={t`Credential Access`}
              value={
                formData?.CredentialGroups?.length
                  ? formData?.CredentialGroups.map((group) => group.GroupName).join(', ')
                  : formData?.CredentialAccesses?.map((access) => access.AccessName).join(', ')
              }
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={isLoading || groupIsLoading || AccessIdsIsLoading}
            />
          )}

        {!(disabled || typeof handleInputChange === 'undefined') && (
          <>
            {formData.CredentialAccessSelect?.label !== 'Individual' && (
              <MultiSelect
                name="CredentialGroupIds"
                label={t`Credential Access`}
                value={formData?.CredentialGroupIds}
                options={groupData?.data.map((item) => ({
                  id: item.GroupNo.toString(),
                  label: item.GroupName,
                }))}
                onChange={handleInputChange}
                disabled={disabled || typeof handleInputChange === 'undefined'}
                isLoading={groupIsLoading}
                error={formErrors?.CredentialGroupIds}
                gridColSpan2
              />
            )}

            {formData.CredentialAccessSelect?.label === 'Individual' && (
              <MultiSelect
                name="CredentialAccessIds"
                label={t`Credential Access`}
                value={formData?.CredentialAccessIds}
                options={AccessIdsData?.data.map((item) => ({
                  id: item.No.toString(),
                  label: item.Name,
                }))}
                onChange={handleInputChange}
                disabled={disabled || typeof handleInputChange === 'undefined'}
                isLoading={isLoading || AccessIdsIsLoading}
                error={formErrors?.CredentialAccessIds}
                gridColSpan2
              />
            )}
          </>
        )}
      </FormCardInputTwoPart>
    </FormCardWithHeader>
  )
}

export default CredentialAccessForm
