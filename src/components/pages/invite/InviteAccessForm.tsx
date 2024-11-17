import { useElementSelectData, useGroupSelectData } from '../../../hooks/useSelectData'
import { THandleInputChange, THandleInputSelect } from '../../../types/components/common'
import { INewFormErrors, accessSelectOption } from '../../../types/pages/common'
import { IInviteFormData } from '../../../types/pages/invite'
import { inviteIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import FormCardWithHeader from '../../HOC/FormCardWithHeader'
import FormCardInputTwoPart from '../../HOC/style/form/FormCardInputTwoPart'
import Selector, { TSelectValue } from '../../atomic/Selector'
import Textarea from '../../atomic/Textarea'
import MultiSelect from '../../common/form/MultiSelect'

interface IProps {
  formData: IInviteFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IInviteFormData>
  disabled?: boolean
  isLoading?: boolean
  isSelected?: boolean
  handleSelect?: THandleInputSelect
}

function InviteAccessForm({
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
      icon={inviteIcon}
      header={t`Invite Access`}
      selectName="AccessSelect"
      isSelected={isSelected}
      handleSelect={handleSelect}
      twoPart={false}
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
            label={t` Access`}
            value={
              formData.AccessSelect?.label === 'Individual'
                ? formData?.AccessIds?.join(', ')
                : formData?.GroupIds?.join(', ')
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
              label={t`Access`}
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

export default InviteAccessForm
