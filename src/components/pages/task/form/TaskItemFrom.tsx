import { taskApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import FormCardInputTwoPart from '../../../../components/HOC/style/form/FormCardInputTwoPart'
import Selector, { TSelectValue } from '../../../../components/atomic/Selector'
import Textarea from '../../../../components/atomic/Textarea'
import MultiSelect from '../../../../components/common/form/MultiSelect'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import {
  IFormErrors,
  ISingleServerResponse,
  accessSelectOption,
} from '../../../../types/pages/common'
import { ITaskElementsResult, ITaskFormData, ITaskInfoFormData } from '../../../../types/pages/task'
import { taskIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: ITaskFormData | ITaskInfoFormData
  formErrors?: IFormErrors
  handleInputChange?: THandleInputChange
  disabled?: boolean
  isLoading?: boolean
}

function TaskItemFrom({ formData, formErrors, handleInputChange, disabled, isLoading }: IProps) {
  // Fetch elements by type from the server
  const { isLoading: elementsIsLoading, data: elementsData } = useSWR<
    ISingleServerResponse<ITaskElementsResult>
  >(
    disabled ||
      typeof handleInputChange === 'undefined' ||
      !formData.ItemSelect?.value ||
      !formData?.ActionType?.value
      ? null
      : taskApi.elements(formData?.ActionType?.value, formData?.ItemSelect?.value)
  )

  const handleTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('TaskItemIds', [])
      handleInputChange('GroupItemIds', [])
    }
  }

  return (
    <FormCardWithHeader icon={taskIcon} header={t`Task Item`} twoPart={false}>
      <FormCardInputTwoPart>
        <Selector
          name="ItemSelect"
          label={t`Select Type`}
          value={formData.ItemSelect}
          options={accessSelectOption}
          onChange={handleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ItemSelect}
          isLoading={isLoading}
        />

        {(disabled || typeof handleInputChange === 'undefined') && 'GroupItems' in formData && (
          <Textarea
            name="groupsAndDevicesInfo"
            label={t`Task Item`}
            value={
              formData?.GroupItems.length
                ? formData?.GroupItems.map((item) => item.GroupName).join(', ')
                : formData?.TaskItems.map((item) => item.ItemName).join(', ')
            }
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading || elementsIsLoading}
          />
        )}
      </FormCardInputTwoPart>

      {!(disabled || typeof handleInputChange === 'undefined') && (
        <>
          {formData.ItemSelect?.value !== '0' && (
            <MultiSelect
              name="GroupItemIds"
              label={t`Task Item`}
              value={formData?.GroupItemIds}
              options={elementsData?.data.TaskItemOptions.map((item) => ({
                id: item.value.toString(),
                label: item.text,
              }))}
              onChange={handleInputChange}
              disabled={
                disabled || typeof handleInputChange === 'undefined' || !formData.ActionType?.value
              }
              isLoading={isLoading || elementsIsLoading}
              error={formErrors?.GroupItemIds}
            />
          )}

          {formData.ItemSelect?.value === '0' && (
            <MultiSelect
              name="TaskItemIds"
              label={t`Task Item`}
              value={formData?.TaskItemIds}
              options={elementsData?.data.TaskItemOptions.map((item) => ({
                id: item.value.toString(),
                label: item.text,
              }))}
              onChange={handleInputChange}
              disabled={
                disabled || typeof handleInputChange === 'undefined' || !formData.ActionType?.value
              }
              isLoading={isLoading || elementsIsLoading}
              error={formErrors?.TaskItemIds}
            />
          )}
        </>
      )}
    </FormCardWithHeader>
  )
}

export default TaskItemFrom
