import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import FormCardInputTwoPart from '../../../../components/HOC/style/form/FormCardInputTwoPart'
import Selector, { TSelectValue } from '../../../../components/atomic/Selector'
import Textarea from '../../../../components/atomic/Textarea'
import MultiSelect from '../../../../components/common/form/MultiSelect'
import { useElementSelectData, useGroupSelectData } from '../../../../hooks/useSelectData'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, accessSelectOption } from '../../../../types/pages/common'
import { IDoorRuleFormData, IDoorRuleInfoFormData } from '../../../../types/pages/doorRule'
import { doorRuleIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
interface IProps {
  formData: IDoorRuleFormData | IDoorRuleInfoFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}
function DoorRulePerson1Form({
  formData,
  formErrors,
  handleInputChange,
  disabled,
  isLoading,
}: IProps) {
  // Fetch elements by type from the server
  const { isLoading: personIsLoading, data: personData } = useElementSelectData(
    disabled ||
      typeof handleInputChange === 'undefined' ||
      formData.PersonSelect?.label !== 'Individual',
    'Person'
  )

  const { isLoading: groupIsLoading, data: groupData } = useGroupSelectData(
    disabled ||
      typeof handleInputChange === 'undefined' ||
      formData.PersonSelect?.label !== 'Group',
    'Person'
  )

  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('PersonIds', [])
      handleInputChange('GroupIds', [])
    }
  }

  return (
    <FormCardWithHeader icon={doorRuleIcon} header={t`Rule Person`} twoPart={false}>
      <FormCardInputTwoPart>
        <Selector
          name="PersonSelect"
          label={t`Select Type`}
          value={formData.PersonSelect}
          options={accessSelectOption}
          onChange={handleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.PersonSelect}
          isLoading={isLoading}
        />
        {(disabled || typeof handleInputChange === 'undefined') && 'Groups' in formData && (
          <Textarea
            name="groupsAndPersons"
            label={t`Rule Person`}
            value={
              formData?.Groups?.length
                ? formData?.Groups.map((group) => group.GroupName).join(', ')
                : formData?.Persons?.map(
                    (person) => `${person.FirstName} ${person.MiddleName} ${person.LastName}`
                  ).join(', ')
            }
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading || groupIsLoading || personIsLoading}
          />
        )}
      </FormCardInputTwoPart>

      {!(disabled || typeof handleInputChange === 'undefined') && (
        <>
          {formData.PersonSelect?.label !== 'Individual' && (
            <MultiSelect
              name="GroupIds"
              label={t`Rule Person`}
              value={formData?.GroupIds}
              options={groupData?.data.map((item) => ({
                id: item.GroupNo.toString(),
                label: item.GroupName,
              }))}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={isLoading || groupIsLoading}
              error={formErrors?.Groups}
            />
          )}

          {formData.PersonSelect?.label === 'Individual' && (
            <MultiSelect
              name="PersonIds"
              label={t`Rule Person`}
              value={formData?.PersonIds}
              options={personData?.data.map((item) => ({
                id: item.No.toString(),
                label: item.Name,
              }))}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={isLoading || personIsLoading}
              error={formErrors?.Persons}
            />
          )}
        </>
      )}
    </FormCardWithHeader>
  )
}

export default DoorRulePerson1Form
