import { definedFieldApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IListServerResponse, INewFormErrors } from '../../../../types/pages/common'
import { IDefinedFieldResult } from '../../../../types/pages/definedField'
import { IPersonFormData } from '../../../../types/pages/person'
import { SERVER_QUERY } from '../../../../utils/config'
import { listIcon } from '../../../../utils/icons'
import PersonDefinedFieldInputs from './PersonDefinedFieldInputs'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IPersonFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IPersonFormData>
  disabled?: boolean
  isLoading?: boolean
}

function PersonDefinedFieldForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  const { isLoading: definedFieldIsLoading, data: definedFieldData } = useSWR<
    IListServerResponse<IDefinedFieldResult[]>
  >(definedFieldApi.list(SERVER_QUERY.selectorDataQuery))

  return (
    <FormCardWithHeader icon={listIcon} header={t`Defined Fields`}>
      {definedFieldData?.data?.map((item) => (
        <PersonDefinedFieldInputs
          key={item.FieldNo}
          definedField={item}
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={disabled}
          isLoading={isLoading}
        />
      ))}
      {definedFieldIsLoading && (
        <Input
          name="Field1"
          label={t` `}
          value={formData?.Field1}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Field1}
          isLoading={isLoading || definedFieldIsLoading}
        />
      )}
      {definedFieldIsLoading && (
        <Input
          name="Field2"
          label={t` `}
          value={formData?.Field2}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Field2}
          isLoading={isLoading || definedFieldIsLoading}
        />
      )}
    </FormCardWithHeader>
  )
}

export default PersonDefinedFieldForm
