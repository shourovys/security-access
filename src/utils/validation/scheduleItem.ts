import { INewFormErrors } from '../../types/pages/common'
import { IScheduleItemFormData } from '../../types/pages/scheduleItem'
import t from '../../utils/translator'

const validateScheduleItemFormData = (
  formData: IScheduleItemFormData
): INewFormErrors<IScheduleItemFormData> => {
  const errors: INewFormErrors<IScheduleItemFormData> = {}

  if (!formData.ScheduleType?.value) {
    errors.ScheduleType = t`Schedule Type is required`
  } else {
    const { value } = formData.ScheduleType
    if (value === '1' && !formData.Weekdays) {
      errors.Weekdays = t`Weekdays are required for Weekly schedule type`
    } else if (value === '2' && !formData.Monthday) {
      errors.Monthday = t`Month Day is required for Monthly schedule type`
    } else if (value === '3' && !formData.OneDate) {
      errors.OneDate = t`One Date is required for OneTime schedule type`
    }
  }

  if (!formData.TimeType?.value) {
    errors.TimeType = t`Time Type is required`
  } else {
    const { value } = formData.TimeType
    if (value === '0' && !formData.StartTime) {
      errors.StartTime = t`Start Time is required for Normal time type`
    }
    if (value === '0' && !formData.EndTime) {
      errors.EndTime = t`End Time is required for Normal time type`
    }

    // Validate Latitude and Longitude
    if (value !== '0') {
      const reg = new RegExp('^-?([1-8]?[1-9]|[1-9]0).{1}d{1,6}')
      if (!formData.Latitude) {
        errors.Latitude = t`Latitude is required`
      } else if (reg.test(formData.Latitude)) {
        errors.Latitude = t`Latitude is not valid`
      }

      if (!formData.Longitude) {
        errors.Longitude = t`Longitude is required`
      } else if (reg.test(formData.Longitude)) {
        errors.Longitude = t`Longitude is not valid`
      }
    }
  }

  return errors
}

export default validateScheduleItemFormData
