import { definedFieldApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange, THandleInputSelect } from '../../../../types/components/common'
import {
  IListServerResponse,
  INewFormErrors,
  ISelectedInputFields,
} from '../../../../types/pages/common'
import { IDefinedFieldResult } from '../../../../types/pages/definedField'
import { IPartitionResult } from '../../../../types/pages/partition'
import {
  IPersonFormData,
  IPersonGroupEditFormData,
  personThreatOptions,
} from '../../../../types/pages/person'
import { SERVER_QUERY } from '../../../../utils/config'
import { personIcon } from '../../../../utils/icons'
import PersonDefinedFieldInputs from './PersonDefinedFieldInputs'
import t from '../../../../utils/translator'

interface IProps {
  formData: IPersonGroupEditFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IPersonFormData>
  disabled?: boolean
  isLoading?: boolean
  // props for checkbox in header
  selectedInputFields?: ISelectedInputFields<IPersonFormData>
  handleSelect?: THandleInputSelect
}

function PersonPersonalGroupEditForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  selectedInputFields,
  handleSelect,
}: IProps) {
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )
  const { isLoading: definedFieldIsLoading, data: definedFieldData } = useSWR<
    IListServerResponse<IDefinedFieldResult[]>
  >(definedFieldApi.list(SERVER_QUERY.selectorDataQuery))

  return (
    <FormCardWithHeader
      icon={personIcon}
      header={t`Person`}
      isSelected={
        selectedInputFields?.Partition &&
        selectedInputFields?.ThreatLevel &&
        selectedInputFields?.Ada &&
        selectedInputFields?.Invite &&
        selectedInputFields?.Exempt &&
        selectedInputFields?.Field1 &&
        selectedInputFields?.Field2 &&
        selectedInputFields?.Field3 &&
        selectedInputFields?.Field4 &&
        selectedInputFields?.Field5 &&
        selectedInputFields?.Field6 &&
        selectedInputFields?.Field7 &&
        selectedInputFields?.Field8 &&
        selectedInputFields?.Field9 &&
        selectedInputFields?.Field10 &&
        selectedInputFields?.Field11 &&
        selectedInputFields?.Field12 &&
        selectedInputFields?.Field13 &&
        selectedInputFields?.Field14 &&
        selectedInputFields?.Field15 &&
        selectedInputFields?.Field16 &&
        selectedInputFields?.Field17 &&
        selectedInputFields?.Field18 &&
        selectedInputFields?.Field19 &&
        selectedInputFields?.Field20
      }
      handleSelect={handleSelect}
    >
      <Selector
        name="Partition"
        label={t`Partition`}
        value={formData.Partition}
        options={partitionData?.data.map((result) => ({
          value: result.PartitionNo.toString(),
          label: result.PartitionName,
        }))}
        isClearable={false}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Partition}
        isLoading={isLoading || partitionIsLoading}
        isSelected={selectedInputFields?.Partition}
        handleSelect={handleSelect}
      />

      {/* Defined Field Inputs  */}
      {definedFieldData?.data?.map((item) => (
        <PersonDefinedFieldInputs
          key={item.FieldNo}
          definedField={item}
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          disabled={disabled}
          isLoading={isLoading}
          selectedInputFields={selectedInputFields}
          handleSelect={handleSelect}
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
      <div className="flex items-center justify-between">
        <SwitchButtonSelect
          name="Ada"
          value={formData.Ada}
          onChange={handleInputChange}
          label={t`ADA`}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
          isSelected={selectedInputFields?.Ada}
          handleSelect={handleSelect}
        />
        <SwitchButtonSelect
          name="Invite"
          value={formData.Invite}
          onChange={handleInputChange}
          label={t`Invite`}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
          isSelected={selectedInputFields?.Invite}
          handleSelect={handleSelect}
        />
        <SwitchButtonSelect
          name="Exempt"
          value={formData.Exempt}
          onChange={handleInputChange}
          label={t`Exempt`}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
          isSelected={selectedInputFields?.Exempt}
          handleSelect={handleSelect}
        />
      </div>
      <Selector
        name="ThreatLevel"
        label={t`Threat Level`}
        options={personThreatOptions}
        value={formData.ThreatLevel}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ThreatLevel}
        isLoading={isLoading}
        isSelected={selectedInputFields?.ThreatLevel}
        handleSelect={handleSelect}
      />
    </FormCardWithHeader>
  )
}

export default PersonPersonalGroupEditForm
