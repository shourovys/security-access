import FormCardWithHeader from '../../../../../components/HOC/FormCardWithHeader'
import DateInput from '../../../../../components/atomic/DateInput'
import Input from '../../../../../components/atomic/Input'
import { THandleDateChange, THandleInputChange } from '../../../../../types/components/common'
import { INewFormErrors } from '../../../../../types/pages/common'
import { IHolidayItemFormData } from '../../../../../types/pages/holidayItem'
import { holidayIcon } from '../../../../../utils/icons'
import t from '../../../../../utils/translator'

interface IProps {
  formData?: IHolidayItemFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IHolidayItemFormData>
  disabled?: boolean
  isLoading?: boolean
}

function HolidayItemForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const handleDateChange: THandleDateChange = (name, value) => {
    if (handleInputChange) {
      handleInputChange('StartDate', value?.startDate)
      handleInputChange('EndDate', value?.endDate)
    }
  }

  return (
    <FormCardWithHeader icon={holidayIcon} header={t`Holiday Item`}>
      <DateInput
        name="Start & End Date"
        label={t`Start & End Date `}
        singleDate={false}
        value={{
          startDate: formData?.StartDate ? formData?.StartDate : null,
          endDate: formData?.EndDate ? formData?.EndDate : null,
        }}
        onChange={handleDateChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.StartDate}
        isLoading={isLoading}
        format="YYYY-MM-DD"
        required={true}
      />
      <Input
        name="DateName"
        label={t`Date Name `}
        value={formData?.DateName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.DateName}
        isLoading={isLoading}
        required={true}
      />
    </FormCardWithHeader>
  )
}

export default HolidayItemForm
