import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import FormCardInputTwoPart from '../../../../components/HOC/style/form/FormCardInputTwoPart'
import Selector, { TSelectValue } from '../../../../components/atomic/Selector'
import Textarea from '../../../../components/atomic/Textarea'
import MultiSelect from '../../../../components/common/form/MultiSelect'
import { useElementSelectData, useGroupSelectData } from '../../../../hooks/useSelectData'
import { THandleInputChange } from '../../../../types/components/common'
import { IAccessFormData, IAccessInfoFormData } from '../../../../types/pages/access'
import { accessSelectOption, IFormErrors } from '../../../../types/pages/common'
import { groupTypes, IGroupTypes } from '../../../../types/pages/group'
import { accessDeviceIcon } from '../../../../utils/icons'
import { swappedValuesWithKey } from '../../../../utils/swappedValuesWithKey'
import t from '../../../../utils/translator'

interface IProps {
  formData: IAccessFormData | IAccessInfoFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function AccessDeviceFrom({
  formData,
  formErrors,
  handleInputChange,
  disabled,
  isLoading,
}: IProps) {
  const groupTypeByKey = swappedValuesWithKey(groupTypes)
  const { isLoading: groupIsLoading, data: groupData } = useGroupSelectData(
    disabled ||
      typeof handleInputChange === 'undefined' ||
      !formData.DeviceType?.label ||
      formData.DeviceSelect?.label !== 'Group',
    groupTypeByKey[formData.DeviceType?.value || ''] as keyof IGroupTypes
  )

  const { isLoading: devicesIsLoading, data: devicesData } = useElementSelectData(
    disabled ||
      typeof handleInputChange === 'undefined' ||
      !formData.DeviceType?.label ||
      formData.DeviceSelect?.label !== 'Individual',
    groupTypeByKey[formData.DeviceType?.value || ''] as keyof IGroupTypes
  )

  // // Fetch elements by type from the server
  // const { isLoading: devicesIsLoading, data: devicesData } = useSWR<
  //   IListServerResponse<IElementsResult[]>
  // >(
  //   formData.DeviceSelect?.value !== 'individual' || !formData.DeviceType?.value
  //     ? null
  //     : ElementsApi.list(`type=${formData?.DeviceType?.value}`)
  // )

  // const { isLoading: groupIsLoading, data: groupData } = useSWR<
  //   IListServerResponse<IGroupResult[]>
  // >(
  //   formData.DeviceSelect?.value !== 'group' || !formData.DeviceType?.value
  //     ? null
  //     : groupApi.list(`${SERVER_QUERY.selectorDataQuery}&type=${formData.DeviceType?.value}`)
  // )

  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('DeviceIds', [])
      handleInputChange('GroupIds', [])
    }
  }

  return (
    <FormCardWithHeader icon={accessDeviceIcon} header={t`Access Device`} twoPart={false}>
      <FormCardInputTwoPart>
        <Selector
          name="DeviceSelect"
          label={t`Select Type`}
          value={formData.DeviceSelect}
          options={accessSelectOption}
          isClearable={false}
          onChange={handleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.DeviceSelect}
          isLoading={isLoading}
        />
        {(disabled || typeof handleInputChange === 'undefined') && 'Groups' in formData && (
          <Textarea
            name="devicesAndGroups"
            label={t`Access Item`}
            value={
              formData?.Groups?.length
                ? formData?.Groups.map((group) => group.GroupName).join(', ')
                : formData?.Devices?.map((device) => device.Name)?.join(', ')
            }
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading || groupIsLoading || devicesIsLoading}
          />
        )}
      </FormCardInputTwoPart>

      {!(disabled || typeof handleInputChange === 'undefined') && (
        <>
          {formData.DeviceSelect?.label !== 'Individual' && (
            <MultiSelect
              name="GroupIds"
              label={t`Access Item`}
              value={formData?.GroupIds}
              options={groupData?.data.map((item) => ({
                id: item.GroupNo.toString(),
                label: item.GroupName,
              }))}
              onChange={handleInputChange}
              // disabled={
              //   disabled || typeof handleInputChange === 'undefined' || !formData.DeviceType?.value
              // }
              isLoading={groupIsLoading}
              error={formErrors?.GroupIds}
            />
          )}

          {formData.DeviceSelect?.label === 'Individual' && (
            <MultiSelect
              name="DeviceIds"
              label={t`Access Item`}
              value={formData?.DeviceIds}
              options={devicesData?.data.map((item) => ({
                id: item.No.toString(),
                label: item.Name,
              }))}
              onChange={handleInputChange}
              // disabled={
              //   disabled || typeof handleInputChange === 'undefined' || !formData.DeviceType?.value
              // }
              isLoading={isLoading || devicesIsLoading}
              error={formErrors?.DeviceIds}
            />
          )}
        </>
      )}
    </FormCardWithHeader>
  )
}

export default AccessDeviceFrom
