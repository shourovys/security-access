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

function DoorRulePerson2Form({
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
      formData.PersonSelect2?.label !== 'Individual',
    'Person'
  )

  const { isLoading: groupIsLoading, data: groupData } = useGroupSelectData(
    disabled ||
      typeof handleInputChange === 'undefined' ||
      formData.PersonSelect2?.label !== 'Group',
    'Person'
  )

  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('PersonIds2', [])
      handleInputChange('GroupIds2', [])
    }
  }

  return (
    <FormCardWithHeader icon={doorRuleIcon} header={t`Rule Person 2`} twoPart={false}>
      <FormCardInputTwoPart>
        <Selector
          name="PersonSelect2"
          label={t`Select Type`}
          value={formData.PersonSelect2}
          options={accessSelectOption}
          onChange={handleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.PersonSelect2}
          isLoading={isLoading}
        />
        {(disabled || typeof handleInputChange === 'undefined') && 'Groups' in formData && (
          <Textarea
            name="groups2AndPersons2"
            label={t`Rule Person`}
            value={
              formData?.Groups2?.length
                ? formData?.Groups2.map((group) => group.GroupName).join(', ')
                : formData?.Persons2?.map(
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
          {formData.PersonSelect2?.label === 'Individual' && (
            <MultiSelect
              name="PersonIds2"
              label={t`Rule Person`}
              value={formData?.PersonIds2}
              options={personData?.data.map((item) => ({
                id: item.No.toString(),
                label: item.Name,
              }))}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={isLoading || personIsLoading}
              error={formErrors?.PersonIds2}
            />
          )}

          {formData.PersonSelect2?.label !== 'Individual' && (
            <MultiSelect
              name="GroupIds2"
              label={t`Rule Person`}
              value={formData?.GroupIds2}
              options={groupData?.data.map((item) => ({
                id: item.GroupNo.toString(),
                label: item.GroupName,
              }))}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={groupIsLoading}
              error={formErrors?.GroupIds2}
            />
          )}
        </>
      )}
    </FormCardWithHeader>
  )
}

export default DoorRulePerson2Form
