import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import FormCardInputTwoPart from '../../../../components/HOC/style/form/FormCardInputTwoPart'
import Selector, { TSelectValue } from '../../../../components/atomic/Selector'
import Textarea from '../../../../components/atomic/Textarea'
import MultiSelect from '../../../../components/common/form/MultiSelect'
import { useElementSelectData, useGroupSelectData } from '../../../../hooks/useSelectData'
import { THandleInputChange, THandleInputSelect } from '../../../../types/components/common'
import { INewFormErrors, accessSelectOption } from '../../../../types/pages/common'
import { IPersonFormData, IPersonGroupEditFormData } from '../../../../types/pages/person'
import { listIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: IPersonFormData | IPersonGroupEditFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IPersonFormData>
  disabled?: boolean
  isLoading?: boolean
  // props for checkbox in header
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function PersonAccessForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
  isSelected,
  handleSelect,
}: IProps) {
  const { isLoading: groupIsLoading, data: groupData } = useGroupSelectData(
    disabled ||
      typeof handleInputChange === 'undefined' ||
      formData.AccessSelect?.label !== 'Group',
    'Access'
  )

  const { isLoading: accessIsLoading, data: accessData } = useElementSelectData(
    disabled ||
      typeof handleInputChange === 'undefined' ||
      formData.AccessSelect?.label !== 'Individual',
    'Access'
  )

  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange('AccessIds', [])
      handleInputChange('GroupIds', [])
      handleInputChange(name, selectedValue)
    }
  }

  return (
    <FormCardWithHeader
      icon={listIcon}
      header={t`Person Access`}
      twoPart={false}
      selectName="AccessSelect"
      isSelected={isSelected}
      handleSelect={handleSelect}
    >
      <FormCardInputTwoPart>
        <Selector
          name="AccessSelect"
          label={t`Select Type`}
          value={formData.AccessSelect}
          options={accessSelectOption}
          isClearable={false}
          onChange={handleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.AccessSelect}
          isLoading={isLoading}
        />
        {(disabled || typeof handleInputChange === 'undefined') && (
          <Textarea
            name="GroupAndDeviceIds"
            label={t`Person Access`}
            value={
              formData.AccessSelect?.label === 'Individual'
                ? formData?.Accesses?.map((access) => access.AccessName).join(', ')
                : formData?.Groups?.map((group) => group.GroupName).join(', ')
            }
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading || groupIsLoading || accessIsLoading}
          />
        )}
      </FormCardInputTwoPart>

      {!(disabled || typeof handleInputChange === 'undefined') && (
        <>
          {formData.AccessSelect?.label !== 'Individual' && (
            <MultiSelect
              name="GroupIds"
              label={t`Person Access`}
              value={formData?.GroupIds}
              options={groupData?.data.map((item) => ({
                id: item.GroupNo.toString(),
                label: item.GroupName,
              }))}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={isLoading || groupIsLoading}
              error={formErrors?.GroupIds}
            />
          )}

          {formData.AccessSelect?.label === 'Individual' && (
            <MultiSelect
              name="AccessIds"
              label={t`Person Access`}
              value={formData?.AccessIds}
              options={accessData?.data.map((item) => ({
                id: item.No.toString(),
                label: item.Name,
              }))}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              isLoading={isLoading || accessIsLoading}
              error={formErrors?.AccessIds}
            />
          )}
        </>
      )}
    </FormCardWithHeader>
  )
}

export default PersonAccessForm
