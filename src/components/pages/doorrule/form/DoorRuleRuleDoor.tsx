import { useElementSelectData, useGroupSelectData } from '../../../../hooks/useSelectData'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, accessSelectOption } from '../../../../types/pages/common'
import { IDoorRuleFormData, IDoorRuleInfoFormData } from '../../../../types/pages/doorRule'
import { doorRuleIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import FormCardWithHeader from '../../../HOC/FormCardWithHeader'
import FormCardInputTwoPart from '../../../HOC/style/form/FormCardInputTwoPart'
import Selector, { TSelectValue } from '../../../atomic/Selector'
import Textarea from '../../../atomic/Textarea'
import MultiSelect from '../../../common/form/MultiSelect'
interface IProps {
  formData: IDoorRuleFormData | IDoorRuleInfoFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}
function DoorRuleRuleDoor({
  formData,
  formErrors,
  handleInputChange,
  disabled,
  isLoading,
}: IProps) {
  // Fetch elements by type from the server
  const { isLoading: doorIsLoading, data: doorData } = useElementSelectData(
    disabled ||
      typeof handleInputChange === 'undefined' ||
      formData.DoorSelect?.label !== 'Individual',
    'Door'
  )

  const { isLoading: groupIsLoading, data: groupData } = useGroupSelectData(
    disabled || typeof handleInputChange === 'undefined' || formData.DoorSelect?.label !== 'Group',
    'Door'
  )

  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('DoorIds', [])
      handleInputChange('GroupDoorIds', [])
    }
  }

  return (
    <FormCardWithHeader icon={doorRuleIcon} header={t`Rule Door`} twoPart={false}>
      <FormCardInputTwoPart>
        <Selector
          name="DoorSelect"
          label={t`Select Type`}
          value={formData.DoorSelect}
          options={accessSelectOption}
          onChange={handleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.DoorSelect}
          isLoading={isLoading}
        />
        {(!disabled || typeof handleInputChange !== 'undefined') && 'Groups' in formData && (
          <Textarea
            name="groupsAndDoors"
            label={t`Rule Door`}
            value={
              (!formData?.Doors?.length &&
                formData?.GroupDoors?.map((group) => group.GroupName).join(', ')) ||
              (!formData?.GroupDoors?.length &&
                formData?.Doors?.map((door) => door.DoorName).join(', ')) ||
              ''
            }
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading || groupIsLoading || doorIsLoading}
          />
        )}
      </FormCardInputTwoPart>

      {!(disabled || typeof handleInputChange === 'undefined') && (
        <>
          {formData.DoorSelect?.label !== 'Individual' && (
            <MultiSelect
              name="GroupDoorIds"
              label={t`Rule Door`}
              value={formData?.GroupDoorIds}
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

          {formData.DoorSelect?.label === 'Individual' && (
            <MultiSelect
              name="DoorIds"
              label={t`Rule Door`}
              value={formData?.DoorIds}
              options={doorData?.data.map((item) => ({
                id: item.No.toString(),
                label: item.Name,
              }))}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={isLoading || doorIsLoading}
              error={formErrors?.Doors}
            />
          )}
        </>
      )}
    </FormCardWithHeader>
  )
}

export default DoorRuleRuleDoor
