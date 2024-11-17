import { THandleDateChange, THandleInputChange } from '../../../../../types/components/common'
import { INewFormErrors } from '../../../../../types/pages/common'
import {
  IScheduleItemFormData,
  monthdayOptions,
  scheduleTypeOptions,
  scheduleWeekdaysOptions,
} from '../../../../../types/pages/scheduleItem'
import { scheduleIcon } from '../../../../../utils/icons'
import t from '../../../../../utils/translator'
import FormCardWithHeader from '../../../../HOC/FormCardWithHeader'
import DateInput from '../../../../atomic/DateInput'
import MultipleCheckbox from '../../../../atomic/MultipleCheckbox'
import Selector, { TSelectValue } from '../../../../atomic/Selector'

interface IProps {
  formData?: IScheduleItemFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IScheduleItemFormData>
  disabled?: boolean
  isLoading?: boolean
}

function ScheduleItemDateForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  const handleDateChange: THandleDateChange = (name, value) => {
    if (handleInputChange) {
      handleInputChange(name, value?.startDate)
    }
  }

  const handleScheduleTypeChange: (name: string, selectedValue: TSelectValue) => void = (
    name,
    selectedValue
  ) => {
    if (handleInputChange) {
      handleInputChange(name, selectedValue)
      handleInputChange('Weekdays', undefined)
      handleInputChange('Monthday', undefined)
      handleInputChange('OneDate', undefined)
    }
  }

  return (
    <FormCardWithHeader icon={scheduleIcon} header={t`Date`} twoPart={false}>
      <div className="grid grid-cols-2 gap-y-3 gap-x-8 ">
        <Selector
          name="ScheduleType"
          label={t`Schedule Type`}
          value={formData?.ScheduleType}
          options={scheduleTypeOptions}
          isClearable={false}
          onChange={handleScheduleTypeChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ScheduleType}
          isLoading={isLoading}
        />
      </div>
      <div className="grid grid-cols-2 gap-y-3 gap-x-8  ">
        {formData?.ScheduleType?.value === '1' && (
          <MultipleCheckbox
            name="Weekdays"
            inputLabel="Weekdays"
            checkboxData={scheduleWeekdaysOptions}
            checked={formData?.Weekdays}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Weekdays}
            isLoading={isLoading}
          />
        )}

        {formData?.ScheduleType?.value === '2' && (
          <Selector
            name="Monthday"
            label={t`Month Day`}
            options={monthdayOptions}
            value={formData?.Monthday}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Monthday}
            isLoading={isLoading}
          />
        )}

        {formData?.ScheduleType?.value === '3' && (
          <DateInput
            name="OneDate"
            label={t`One Date`}
            value={{
              startDate: formData.OneDate ? formData.OneDate : null,
              endDate: formData.OneDate ? formData.OneDate : null,
            }}
            onChange={handleDateChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.OneDate}
            isLoading={isLoading}
            // format="YYYY-MM-DD"
          />
        )}
      </div>
    </FormCardWithHeader>
  )
}

export default ScheduleItemDateForm
