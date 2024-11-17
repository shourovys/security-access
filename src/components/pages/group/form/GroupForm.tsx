import useSWR from 'swr'
import { partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import FormCardInputTwoPart from '../../../../components/HOC/style/form/FormCardInputTwoPart'
import Input from '../../../../components/atomic/Input'
import Selector, { ISelectOption, TSelectValue } from '../../../../components/atomic/Selector'
import Textarea from '../../../../components/atomic/Textarea'
import MultiSelect from '../../../../components/common/form/MultiSelect'
import useAuth from '../../../../hooks/useAuth'
import useLicenseFilter from '../../../../hooks/useLicenseFilter'
import { useElementSelectData } from '../../../../hooks/useSelectData'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import {
  IGroupFormData,
  IGroupInfoFormData,
  IGroupTypes,
  groupTypes,
  groupTypesOptions,
} from '../../../../types/pages/group'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import { swappedValuesWithKey } from '../../../../utils/swappedValuesWithKey'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IGroupFormData | IGroupInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function GroupForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  // Fetch elements by type from the server

  // Fetch elements by type from the server
  const groupTypeByKey = swappedValuesWithKey(groupTypes)
  const { isLoading: groupItemsIsLoading, data: groupItemsData } = useElementSelectData(
    // disabled || typeof handleInputChange === 'undefined' ||
    !formData?.GroupType?.label,
    groupTypeByKey[formData?.GroupType?.value || ''] as keyof IGroupTypes
  )

  // call handleInputChange with reset group_object_ids when type changes
  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('GroupItemIds', [])
    }
  }

  const filteredGroupTypesOptions = useLicenseFilter<ISelectOption>(groupTypesOptions, {
    '8': 'Camera',
    '12': 'Lockset',
    '13': 'Facegate',
    '17': 'ContLock',
    '18': 'Intercom',
  })

  return (
    <FormCardWithHeader icon={doorIcon} header={t`Group`} twoPart={false}>
      <FormCardInputTwoPart>
        {showPartition && (
          <Selector
            name="Partition"
            label={t`Partition`}
            value={formData?.Partition}
            options={partitionData?.data.map((result) => ({
              value: result.PartitionNo.toString(),
              label: result.PartitionName,
            }))}
            isClearable={false}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Partition}
            isLoading={isLoading || partitionIsLoading}
          />
        )}
        <Input
          name="GroupName"
          label={t`Group Name `}
          value={formData?.GroupName}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.GroupName}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
        <Input
          name="GroupDesc"
          label={t`Description`}
          value={formData?.GroupDesc}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.GroupDesc}
          isLoading={isLoading}
        />

        <Selector
          name="GroupType"
          label={t`Group Type`}
          value={formData?.GroupType}
          options={filteredGroupTypesOptions}
          onChange={handleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.GroupType}
        />
      </FormCardInputTwoPart>

      {(disabled || typeof handleInputChange === 'undefined') &&
        formData &&
        'GroupItems' in formData && (
          <Textarea
            name="GroupItems"
            label={t`Group Item`}
            value={formData?.GroupItems}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading || groupItemsIsLoading}
          />
        )}

      {!(disabled || typeof handleInputChange === 'undefined') && (
        <MultiSelect
          name="GroupItemIds"
          label={t`Group Item`}
          value={formData?.GroupItemIds}
          onChange={handleInputChange}
          options={groupItemsData?.data.map((item) => ({
            id: item.No.toString(),
            label: item.Name,
          }))}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading || groupItemsIsLoading}
          error={formErrors?.GroupItemIds}
        />
      )}
    </FormCardWithHeader>
  )
}

export default GroupForm
